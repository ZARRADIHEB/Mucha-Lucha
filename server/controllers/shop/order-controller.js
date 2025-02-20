import paypal from "../../helpers/paypal.js";
import OrderModel from "../../models/Order.js";
import CartModel from "../../models/Cart.js";

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentStatus,
      paymentMethod,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.FRONTEND_URL}/shop/paypal-return`,
        cancel_url: `${process.env.FRONTEND_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "description",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        console.error("PayPal API Error:", JSON.stringify(error, null, 2));
        return res.status(500).json({
          message: "Error creating payment",
          success: false,
          error: error.response || error.message || error,
        });
      } else {
        const newCreatedOrder = new OrderModel({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentStatus,
          paymentMethod,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });

        await newCreatedOrder.save();

        const approvalUrl = payment.links.find(
          (link) => link.rel === "approval_url"
        ).href;

        if (!approvalUrl) {
          return res.status(500).json({
            message: "No approval URL returned from PayPal",
            success: false,
          });
        }

        return res.status(200).json({
          message: "Payment created successfully",
          success: true,
          approvalUrl,
          orderId: newCreatedOrder._id,
          data: newCreatedOrder,
        });
      }
    });
  } catch (error) {
    console.error("Error placing order :", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message || error,
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    const getCardId = order.cartId;

    await CartModel.findByIdAndDelete(getCardId);

    await order.save();

    return res.status(200).json({
      message: "Payment captured successfully",
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error placing order :", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message || error,
    });
  }
};

const getAllOrderByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await OrderModel.find({ userId });

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

const getOrderDetails = async (req, res) => {
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

export { createOrder, capturePayment, getAllOrderByUser, getOrderDetails };
