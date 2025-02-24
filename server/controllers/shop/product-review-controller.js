import OrderModel from "../../models/Order.js";
import ProductModel from "../../models/Product.js";
import ReviewModel from "../../models/Review.js";

const addProductReview = async (req, res) => {
  try {
    const { productId, rating, userId, userName, reviewMessage } = req.body;

    const order = await OrderModel.findOne({
      userId: userId,
      "cartItems.productId": productId,
      orderStatus: "Confirmed",
    });

    if (!order) {
      return res
        .status(403)
        .json({ message: "You can only review products you have purchased" });
    }

    const existingReview = await ReviewModel.findOne({
      productId: productId,
      userId: userId,
    });

    if (existingReview) {
      return res
        .status(403)
        .json({ message: "You have already reviewed this product" });
    }

    const newReview = new ReviewModel({
      productId,
      userId,
      userName,
      reviewMessage,
      rating,
    });

    await newReview.save();

    const reviews = await ReviewModel.find({ productId: productId });
    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / totalReviews;

    await ProductModel.findOneAndUpdate(
      { _id: productId },
      {
        averageRating,
      }
    );

    res.status(201).json({
      message: "Review added successfully",
      success: true,
      data: newReview,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProductsReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ReviewModel.find({ productId });

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const AllReviews = async (req, res) => {
  try {
    const reviewsList = await ReviewModel.find();
    res.status(200).json({ success: true, data: reviewsList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { addProductReview, getProductsReview, AllReviews };
