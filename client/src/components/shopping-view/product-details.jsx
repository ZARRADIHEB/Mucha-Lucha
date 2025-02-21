import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import PropTypes from "prop-types";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "@/hooks/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Input } from "../ui/input";
import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useState } from "react";
import { addReview } from "@/store/shop/review-slice";

const ProductDetailsDialog = ({ open, setOpen, productDetails, user }) => {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);

  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.shopCart);

  const handleAddToCart = (getCurrentProductId, getTotalStock) => {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );

      if (indexOfCurrentItem !== -1) {
        const quantityInOrder = getCartItems[indexOfCurrentItem]?.quantity || 0;

        if (quantityInOrder + 1 > getTotalStock) {
          toast({
            title: `Only ${getTotalStock} items left in stock`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(data.payload.data.userId));
        toast({
          title: "Product sent to cart",
          className: "bg-green-500",
        });
      }
    });
  };

  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setProductDetails());
  };

  const handleRatingChange = (rating) => {
    setRating(rating);
  };

  const handleAddReview = () => {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?._id,
        userName: user?.userName,
        rating,
        reviewMessage: reviewMsg,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Review added successfully",
          className: "bg-green-500",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-rows-1 md:grid-cols-2 md:grid-rows-none gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]  max-h-screen">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="">
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-4 max-h-[200px] overflow-y-auto lg:max-h-screen ">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-2xl  font-bold text-primary ${
                productDetails?.salePrice > 0 &&
                productDetails?.totalStock !== 0
                  ? "line-through opacity-50"
                  : ""
              }`}
            >
              ${productDetails?.price}
            </p>

            {productDetails?.salePrice > 0 &&
            productDetails?.totalStock !== 0 ? (
              <p className="text-2xl font-bold ">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarIcon className="size-5 fill-primary" />
              <StarIcon className="size-5 fill-primary" />
              <StarIcon className="size-5 fill-primary" />
              <StarIcon className="size-5 fill-primary" />
              <StarIcon className="size-5 fill-primary" />
            </div>
            <span>(4,5)</span>
          </div>

          <div className="my-5">
            <Button
              onClick={() =>
                handleAddToCart(productDetails?._id, productDetails?.totalStock)
              }
              className={`w-full ${
                productDetails?.totalStock === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {productDetails?.totalStock === 0
                ? "Out of stock"
                : "Add to cart"}
            </Button>
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-y-scroll">
            <h2 className="text-xl font-bold my-4">Reviews</h2>
            <div className="grid gap-6">
              <div className="flex gap-4">
                <Avatar className="size-10 border">
                  <AvatarFallback>{user.userName[0]}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{user.userName}</h3>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                  </div>
                  <p className="text-muted-foreground">Very good</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Avatar className="size-10 border">
                  <AvatarFallback> {user.userName[0]}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{user.userName}</h3>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                  </div>
                  <p className="text-muted-foreground">Very good</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Avatar className="size-10 border">
                  <AvatarFallback>{user.userName[0]}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{user.userName}</h3>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                    <StarIcon className="size-5 fill-primary" />
                  </div>
                  <p className="text-muted-foreground">Very good</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Label>Write a review</Label>
              <div className="flex  gap-1">
                {
                  <StarRatingComponent
                    rating={rating}
                    handleRatingChange={handleRatingChange}
                  />
                }
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Write a review..."
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
ProductDetailsDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  _id: PropTypes.string,

  productDetails: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    salePrice: PropTypes.number,
    price: PropTypes.number,
    totalStock: PropTypes.number,
    id: PropTypes.string,
  }),
  user: PropTypes.shape({
    userName: PropTypes.string,
    _id: PropTypes.string,
    id: PropTypes.string,
  }),
};

export default ProductDetailsDialog;
