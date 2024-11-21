import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getrecommendationsProducts,
  toogleFeaturedProduct,
} from "../controllers/products.controller.js";
import { adminAccess, protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminAccess, getAllProducts);
router.get("/featured-products", getFeaturedProducts);
router.get("/recommendations-products", getrecommendationsProducts);
router.get("/category/:category", getProductsByCategory);
router.post("/", protectRoute, adminAccess, createProduct);
router.delete("/:id", protectRoute, adminAccess, deleteProduct);
router.patch("/:id", protectRoute, adminAccess, toogleFeaturedProduct);

export default router;
