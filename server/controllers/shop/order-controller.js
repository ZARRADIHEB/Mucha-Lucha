import paypal from "../../helpers/paypal.js";
import OrderModel from "../../models/order.js";

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
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/shop/paypal-return",
        cancel_url: "http://localhost:3000/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => {
              return {
                name: item.title,
                sku: item.productId,
                price: item.price.toFixed(2),
                currency: "USD",
                quantity: item.quantity,
              };
            }),

            amount: {
              currency: "USD",
              total: totalAmount.toFixed(2),
            },
            description: "This is the payment description.",
          },
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, payment) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error creating payment",
          success: false,
          error: error.message || error,
        });
      } else {
        const newlycreatedOrder = new OrderModel({});
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
  } catch (error) {
    console.error("Error placing order :", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message || error,
    });
  }
};

export { createOrder, capturePayment };
