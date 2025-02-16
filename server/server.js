import express from "express";
import connectDB from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/auth/auth-routes.js";
import dotenv from "dotenv";
dotenv.config();
import adminProductsRouter from "./routes/admin/products-routes.js";
import shopProductsRouter from "./routes/shop/products-routes.js";
import shopCartRouter from "./routes/shop/cart-routes.js";
import shopAddressRouter from "./routes/shop/address-routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
cors({
origin: process.env.FRONTEND_URL,
methods: ["GET", "POST", "DELETE", "PUT"],
allowedHeaders: [
"Content-Type",
"Authorization",
"Cache-Control",
"Expires",
"Pragma",
],
credentials: true,
})
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running => ${process.env.FRONTEND_URL}`);
  } catch (error) {
    console.log("Error when running the server", error);
  }
});
