import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(`connected to Mongo Database: ${connection.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection failed", error.message);
    process.exit(1);
  }
};
