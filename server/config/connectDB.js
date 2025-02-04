import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const URI = process.env.URI;

export const connectDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Connected to DB...");
  } catch (error) {
    console.log("Error occurred when connecting to DB", error);
  }
};

export default connectDB;
