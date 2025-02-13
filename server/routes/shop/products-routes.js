import express from "express";
import {
  getFilteredProducts,
  getProductsDetails,
} from "../../controllers/shop/products-controller.js";

const router = express.Router();

router.get("/get", getFilteredProducts);
router.get("/get/:id", getProductsDetails);

export default router;
