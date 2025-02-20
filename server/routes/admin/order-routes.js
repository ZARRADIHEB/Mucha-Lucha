import express from "express";
import {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "../../controllers/admin/order-controller.js";

const router = express.Router();

router.get("/get", getAllOrdersOfAllUsers);
router.get("/details/:orderId", getOrderDetailsForAdmin);

router.put("/update/:orderId", updateOrderStatus);

export default router;
