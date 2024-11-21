import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  addTocart,
  getAllCartProducts,
  removeAllFromCart,
  updateQuntity,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", protectRoute, getAllCartProducts);
router.post("/", protectRoute, addTocart);
router.delete("/", protectRoute, removeAllFromCart);
router.put("/:id", protectRoute, updateQuntity);

export default router;
