import { useDispatch, useSelector } from "react-redux";
import img from "../../assets/account.jpg";
import Address from "./address";
import UserCartItemsContent from "./cart-items-content";
// import { Button } from "@/components/ui/button";
// import { FaPaypal } from "react-icons/fa";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { toast } from "@/hooks/use-toast";
import OrderBtn from "@/components/shopping-view/OrderBtn";

const ShoppingCheckout = () => {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalUrl } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStarted, setIsPaymentStarted] = useState(false);
  const dispatch = useDispatch();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const handleInitiatePaypalPayment = () => {
    if (cartItems.items.length === 0) {
      return toast({
        title: "Please add items to cart",
        variant: "destructive",
      });
    }

    if (!currentSelectedAddress) {
      return toast({
        title: "Please select an address",
        variant: "destructive",
      });
    }

    const orderData = {
      userId: user.id,
      cartId: cartItems._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
      })),
      addressInfo: {
        userName: user.userName,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        zipcode: currentSelectedAddress?.zipcode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "Pending",
      paymentStatus: "Pending",
      paymentMethod: "paypal",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data.payload?.success) {
        toast({
          title: "Order created successfully",
          className: "bg-green-500 ",
        });
        setIsPaymentStarted(true);
      } else {
        setIsPaymentStarted(false);
      }
    });
  };

  if (isPaymentStarted && approvalUrl) {
    window.location.href = approvalUrl;
  }

  return (
    <div className=" flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={img}
          alt="Checkout Image"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-5 p-5">
        <Address
          setCurrentSelectedAddress={setCurrentSelectedAddress}
          numberOfCols={2}
        />
        <div className="flex flex-col gap-5">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent key={item._id} cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between ">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full text-center">
            {
              <OrderBtn
                handleInitiatePaypalPayment={handleInitiatePaypalPayment}
                currentSelectedAddress={currentSelectedAddress}
              />
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCheckout;
