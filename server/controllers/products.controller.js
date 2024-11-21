import asyncHandler from "express-async-handler";
import Product from "../models/product.model.js";
import redis from "../libraries/redis.js";
import cloudinary from "../libraries/cloudinary.js";
import appError from "../util/appError.js";

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({});
  res.status(200).json({ products });
});

export const getFeaturedProducts = asyncHandler(async (req, res, next) => {
  let featuredProducts = await redis.get("featured_products");
  if (featuredProducts) {
    return res.status(200).json(JSON.parse(featuredProducts));
  }

  featuredProducts = await Product.find({ isFeatured: true }).lean();
  if (!featuredProducts) {
    return next(
      new appError("No featured products found", httpStatus.ERROR, 400)
    );
  }

  await redis.set("featured_products", JSON.stringify(featuredProducts));
  res.status(200).json({
    featuredProducts,
  });
});

export const getrecommendationsProducts = asyncHandler(
  async (req, res, next) => {
    const products = await Product.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    res.json(products);
    if (!products)
      return next(
        new appError("No recommendations products found", httpStatus.ERROR, 400)
      );

    res.status(200).json(products);
  }
);

export const getProductsByCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.params;
  const products = await Product.find({ category });
  if (!products) {
    return next(new appError("No products found", httpStatus.ERROR, 400));
  }

  res.status(200).json({
    msg: "products fetched successfully",
    products,
  });
});

export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, image, category } = req.body;
  let cloudinaryResponse = null;
  if (image) {
    cloudinaryResponse = await cloudinary.uploader.upload(image, {
      folder: "products",
    });
  }
  const product = await Product.create({
    name,
    description,
    price,
    image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
    category,
  });

  res.status(201).json({
    msg: "product created successfully",
    product,
  });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new appError("product not found", httpStatus.ERROR, 400));
  }

  if (product.image) {
    const publicId = product.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  }

  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({ msg: "product deleted successfully" });
});

export const toogleFeaturedProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new appError("product not found", httpStatus.ERROR, 400));
  }
  product.isFeatured = !product.isFeatured;
  await product.save();
  updateFeaturedProductCache();
  res.status(200).json({
    msg: "product updated to featured successfully",
    product,
  });
});

const updateFeaturedProductCache = asyncHandler(async (req, res, next) => {
  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  if (!featuredProducts) {
    return next(
      new appError("No featured products found", httpStatus.ERROR, 400)
    );
  }
  await redis.set("featured_products", JSON.stringify(featuredProducts));
});
