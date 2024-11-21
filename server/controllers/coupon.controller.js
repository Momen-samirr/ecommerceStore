import asyncHandler from "express-async-handler";
import Coupon from "../models/coupon.model.js";
import appError from "../util/appError.js";
import httpStatus from "../util/httpStatus.js";

export const getCoupon = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const coupon = await Coupon.findOne({ userId: user._id, isActive: true });
  res.status(200).json(coupon);
});

export const validateCoupon = asyncHandler(async (req, res, next) => {
  const { couponCode } = req.body;
  const coupon = await Coupon.findOne({
    code: couponCode,
    userId: req.user._id,
    isActive: true,
  });
  console.log(coupon);

  if (!coupon) {
    return next(new appError("coupon not found", httpStatus.ERROR, 401));
  }
  if (coupon.expirationDate < new Date()) {
    return next(new appError("coupon expired", httpStatus.ERROR, 401));
  }
  res.status(200).json({
    msg: "coupon validated successfully",
    coupon,
    code: coupon.code,
    expirationDate: coupon.expirationDate,
    discountPercentage: coupon.discountPercentage,
  });
});
