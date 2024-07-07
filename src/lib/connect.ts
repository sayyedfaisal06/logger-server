import mongoose from "mongoose";
import { config } from "../config";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.database.url);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
