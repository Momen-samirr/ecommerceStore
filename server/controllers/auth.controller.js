import User from "../models/user.model.js";
import genrateTokens from "../util/genrateTokens.js";
import storeRefreshToken from "../util/storeRefreshToken.js";
import setCookies from "../util/setCookies.js";
import redis from "../libraries/redis.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import appError from "../util/appError.js";
import httpStatus from "../util/httpStatus.js";

export const signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const exitUser = await User.findOne({ email });

  if (exitUser) {
    return next(new appError("user already exist", httpStatus.FAIL, 400));
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  //*authentication
  const { accessToken, refreshToken } = genrateTokens(newUser._id);
  await storeRefreshToken(newUser._id, refreshToken);

  setCookies(res, accessToken, refreshToken);

  res.status(201).json({ msg: "user created successfully", user: newUser });
});

export const logIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.comparePassword(password))) {
    //*authentication
    const { accessToken, refreshToken } = genrateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);
    setCookies(res, accessToken, refreshToken);
    res.status(200).json({ msg: "logged in successfully", user });
  } else {
    return next(
      new appError("invalid email or password", httpStatus.ERROR, 400)
    );
  }
});

export const logOut = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    await redis.del(`refreshToken: ${decoded.userId}`);

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    res.status(200).json({ msg: "logged out successfully" });
  }
});

export const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return next(new appError("refresh token not found", httpStatus.FAIL, 401));
  }
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  if (!decoded) {
    return next(new appError("invalid refresh token", httpStatus.FAIL, 401));
  }

  const storedRefreshToken = await redis.get(`refreshToken: ${decoded.userId}`);
  if (storedRefreshToken != refreshToken) {
    return next(new appError("invalid refresh token", httpStatus.FAIL, 401));
  }
  const reAcessToken = jwt.sign(
    { userId: decoded.userId },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
  res.cookie("accessToken", reAcessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.status(200).json({
    msg: "access token refreshed successfully",
  });
});

export const getProfile = asyncHandler(async (req, res, next) => {
  res.json(req.user);
});
