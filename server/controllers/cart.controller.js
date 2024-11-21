import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";

export const getAllCartProducts = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const products = await Product.find({ _id: { $in: user.cartItems } });

  const cartItems = products.map((product) => {
    const item = user.cartItems.find((cartItem) => cartItem.id === product.id);
    return {
      ...product.toJSON(),
      quantity: item.quantity,
    };
  });

  res.status(200).json(cartItems);
});

export const addTocart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const user = req.user;
  const existingProduct = user.cartItems.find((item) => item.id === productId);
  if (existingProduct) {
    existingProduct.quantity += 1;
  }
  user.cartItems.push(productId);
  await user.save();
  res.status(200).json(user.cartItems);
});

export const removeAllFromCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const user = req.user;
  if (!productId) {
    user.cartItems = [];
  }

  user.cartItems = user.cartItems.filter((item) => item.id !== productId);
  await user.save();
  res.status(200).json(user.cartItems);
});

export const updateQuntity = asyncHandler(async (req, res, next) => {
  const { id: productId } = req.params;
  const user = req.user;
  const { quantity } = req.body;

  const existingProduct = user.cartItems.find((item) => item.id === productId);
  if (existingProduct) {
    if (quantity === 0) {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
      await user.save();
      return res.status(200).json(user.cartItems);
    } else {
      existingProduct.quantity = quantity;
      await user.save();
      return res.status(200).json(user.cartItems);
    }
  }
});
