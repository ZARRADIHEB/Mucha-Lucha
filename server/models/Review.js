import mongoose from "mongoose";

const ProductReviewSchema = new mongoose.Schema(
  {
    productId: String,
    userId: String,
    userName: String,
    reviewMessage: String,
    rating: Number,
  },
  { timestamps: true }
);

const ReviewModel = mongoose.model("ProductReview", ProductReviewSchema);

export default ReviewModel;
