import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
dotenv.config();

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

const PORT = process.env.PORT;
const __dirname = path.resolve();

import authRoutes from "./rouets/auth.route.js";
import productRoutes from "./rouets/product.route.js";
import cartRoutes from "./rouets/cart.route.js";
import couponRoutes from "./rouets/coupon.route.js";
import paymentRoutes from "./rouets/payment.route.js";
import analyticsRoutes from "./rouets/analytics.route.js";
import { connectDB } from "./libraries/dB.js";
import globalError from "./middlewares/globalError.js";
import appError from "./util/appError.js";
import httpStatus from "./util/httpStatus.js";

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(cors());

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://react-ui:3000",
  credentials: true,
};

app.use(cors(corsOptions));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

//health check
app.get("/", (req, res) => {
  res.send("ok from mo2");
});

app.get("/api/auth/login", (req, res) => {
  res.status(200).json({ message: "Test login route is working!" });
});

app.all("*", (req, res, next) => {
  next(new appError("invalid Url", httpStatus.FAIL, 500));
});
app.use(globalError);

app.listen(PORT, (req, res) => {
  console.log(`listening on port ${PORT}`);
  connectDB();
});
