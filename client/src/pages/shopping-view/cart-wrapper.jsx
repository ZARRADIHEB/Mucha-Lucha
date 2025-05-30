import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const UserCartWrapper = ({ cartItems, setOpenCartSheet }) => {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;
  return (
    <SheetContent className="sm:max-w-md overflow-y-scroll">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4 ">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item) => (
              <>
                <UserCartItemsContent key={item.productId} cartItem={item} />
                <Separator />
              </>
            ))
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between ">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount}</span>
        </div>
      </div>
      <Button
        onClick={() => {
          navigate("/shop/Checkout");

          setOpenCartSheet(false);
        }}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </SheetContent>
  );
};
UserCartWrapper.propTypes = {
  cartItems: PropTypes.array,
  setOpenCartSheet: PropTypes.func.isRequired,
};

export default UserCartWrapper;
