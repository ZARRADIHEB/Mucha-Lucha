import express from "express";
import {
  addProductReview,
  AllReviews,
  getProductsReview,
} from "../../controllers/shop/product-review-controller.js";

const router = express.Router();

router.post("/add", addProductReview);

router.get("/get/:productId", getProductsReview);
router.get("/all", AllReviews);

export default router;
