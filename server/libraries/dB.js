import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb+srv://midoalzahbe:AkUT5yB2BIjAocuu@cluster0.n7okg.mongodb.net/store?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log(`connected to Mongo Database: ${connection.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection failed", error.message);
    process.exit(1);
  }
};
