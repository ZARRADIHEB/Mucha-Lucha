import express from "express";
import {
  addProductReview,
  getProductsReview,
} from "../../controllers/shop/product-review-controller.js";

const router = express.Router();

router.post("/add", addProductReview);

router.get("/:productId", getProductsReview);

export default router;
