import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import appError from "../util/appError.js";
import User from "../models/user.model.js";
import httpStatus from "../util/httpStatus.js";
export const protectRoute = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return next(new appError("unauthorized user", httpStatus.FAIL, 401));
  }
  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  const user = await User.findById(decoded.userId);

  if (!user) {
    return next(new appError("user not found", httpStatus.ERROR, 401));
  }

  req.user = user;
  next();
});

export const adminAccess = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return next(new appError("access denied for admin", httpStatus.FAIL, 401));
  }
});
