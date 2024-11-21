import express from "express";
import {
  getProfile,
  logIn,
  logOut,
  refreshAccessToken,
  signUp,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/logout", logOut);
router.post("/refresh-acess-token", refreshAccessToken);
router.get("/profile", protectRoute, getProfile);

export default router;
