import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import Loader from "@/components/common/Loading";

const PaypalReturnPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("orderId"));
      dispatch(capturePayment({ paymentId, payerId, orderId }))
        .then((data) => {
          if (data.payload.success) {
            sessionStorage.removeItem("orderId");
            window.location.href = "/shop/payment-success";
          } else {
            setError("Payment processing failed. Please try again.");
            setLoading(false);
          }
        })
        .catch(() => {
          setError("An error occurred. Please try again later.");
          setLoading(false);
        });
    } else {
      setError("Invalid payment details. Please try again.");
      setLoading(false);
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <Card className="max-w-full  p-4 my-8">
      <CardHeader>
        <CardTitle className="text-xl lg:text-2xl text-center">
          Processing your payment...
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
        {loading ? (
          <Loader height="100%" />
        ) : error ? (
          <div className="text-red-500 font-semibold">{error}</div>
        ) : (
          <div className="text-green-500 font-semibold">
            Payment Successful!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaypalReturnPage;
