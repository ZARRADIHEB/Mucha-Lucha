import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { deleteCartItems, updateCartItems } from "@/store/shop/cart-slice";
import { Minus, Plus, Trash } from "lucide-react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

const UserCartItemsContent = ({ cartItem }) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);

  const handleUpdateQuantity = (getCartItem, typeOfAction) => {
    if (typeOfAction === "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem.productId
        );

        const getTotalStock = productList[getCurrentProductIndex]?.totalStock;

        if (indexOfCurrentItem !== -1) {
          const quantityInOrder =
            getCartItems[indexOfCurrentItem]?.quantity || 0;

          if (quantityInOrder + 1 > getTotalStock) {
            toast({
              title: `Only ${getTotalStock} items left in stock`,
              variant: "destructive",
            });
            return;
          }
        }
      }
    }

    dispatch(
      updateCartItems({
        userId: user.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem.quantity + 1
            : getCartItem.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cart item updated successfully",
          className: "bg-green-500",
        });
      }
    });
  };

  const handleCartItemDelete = (getCartItem) => {
    dispatch(
      deleteCartItems({ userId: user.id, productId: getCartItem.productId })
    ).then((data) => {
      data?.payload?.success
        ? toast({
            title: "Cart item deleted successfully",
            className: "bg-green-500",
          })
        : null;
    });
  };
  return (
    <div className="flex items-center space-x-4">
      <img
        className="size-16 sm:size-20 rounded flex-shrink-0 object-cover"
        src={cartItem?.image}
        alt={cartItem?.title}
      />
      <div className="flex-1 ">
        <h3 className="font-extrabold">{cartItem.title}</h3>
        <div className="flex items-center mt-2 gap-1.5 sm:gap-3">
          <Button
            variant="outline"
            size="icon"
            className="size-6 sm:size-8 rounded-full "
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
            disabled={cartItem?.quantity === 1}
          >
            <Minus className="size-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold text-xs sm:text-base">
            {cartItem.quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-6 sm:size-8  rounded-full "
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="size-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-7">
        <p className="font-semibold text-sm sm:text-lg">
          $
          {(cartItem?.salePrice
            ? cartItem?.salePrice * cartItem?.quantity
            : cartItem?.price * cartItem?.quantity
          ).toFixed(2)}
        </p>

        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer  text-red-800"
          size={20}
        />
      </div>
    </div>
  );
};
UserCartItemsContent.propTypes = {
  cartItem: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    salePrice: PropTypes.number,
    productId: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      salePrice: PropTypes.number,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number,
      title: PropTypes.string.isRequired,
    }).isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};

export default UserCartItemsContent;
