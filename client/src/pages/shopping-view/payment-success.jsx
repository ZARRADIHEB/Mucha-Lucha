import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";

const PaymentSuccessPage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: -1500 },
      { opacity: 1, y: 0, duration: 1 }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen  p-4 dark:bg-main-background dark:text-white"
    >
      <div className="bg-white dark:bg-gray-900 dark:text-white rounded-lg shadow-xl p-8 text-center">
        <div className="text-green-500 text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Payment Successful!
        </h1>
        <p className="text-gray-500 mb-6">
          Thank you for your payment. Your transaction has been completed
          successfully.
        </p>
        <div className="flex flex-col sm:flex-row sm:gap-4 gap-2 items-center justify-center">
          <Link
            to="/shop/home"
            className="inline-block py-3 px-6 sm:px-10 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition-colors w-full sm:w-auto text-center"
          >
            Back to Home
          </Link>
          <Link
            to="/shop/account"
            className="inline-block py-3 px-6 sm:px-10 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition-colors w-full sm:w-auto text-center"
          >
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
