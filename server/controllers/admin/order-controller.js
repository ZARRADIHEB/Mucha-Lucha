import OrderModel from "../../models/Order.js";

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await OrderModel.find();

    if (!orders) {
      return res.status(404).json({
        message: "No order found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Orders fetched successfully",
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error getting order :", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message || error,
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "No order found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
      success: true,
      data: order,
    });
  } catch {
    console.error("Error getting order :", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message || error,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    const order = await OrderModel.findOneAndUpdate(
      { orderId },
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "No order found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      success: true,
      data: order,
    });
  } catch {
    console.error("Error updating order status :", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message || error,
    });
  }
};

export { getAllOrdersOfAllUsers, getOrderDetailsForAdmin, updateOrderStatus };
