import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import PropTypes from "prop-types";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { toast } from "@/hooks/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

const ProductDetailsDialog = ({ open, setOpen, productDetails, user }) => {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [isOpenOrderDetails, setIsOpenOrderDetails] = useState(false);

  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

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
    setRating(0);
    setReviewMsg("");
    setIsOpenOrderDetails(false);
  };

  const handleRatingChange = (rating) => {
    setRating(rating);
  };

  const handleAddReview = () => {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        rating,
        reviewMessage: reviewMsg,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(getReviews(productDetails?._id));
        setRating(0);
        setReviewMsg("");
        toast({
          title: "Review added successfully",
          className: "bg-green-500",
        });
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  };

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
      : 0;

  useEffect(() => {
    if (productDetails !== null) {
      dispatch(getReviews(productDetails?._id));
    }
  }, [productDetails, dispatch]);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="flex flex-col gap-4 p-4 max-w-[95vw] h-[90vh] overflow-y-auto sm:grid sm:grid-cols-2 sm:gap-8 sm:p-12 sm:max-w-[80vw] lg:max-w-[70vw]">
        {/* Image Section */}
        <div className="rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
          {/* Title  */}
          <h1 className="text-2xl font-extrabold mt-4 sm:text-3xl">
            {productDetails?.title}
          </h1>
        </div>

        {/* Details Section */}
        <div className="mt-4 flex flex-col h-full">
          {/* Collapsible Description */}
          <Collapsible
            open={isOpenOrderDetails}
            onOpenChange={setIsOpenOrderDetails}
            className="my-4"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full transition-all duration-300 ease-in-out"
              >
                <span className="text-muted-foreground">
                  {isOpenOrderDetails ? "Hide Description" : "View Description"}
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="CollapsibleContent transition-all duration-300 ease-in-out overflow-hidden data-[state=open]:animate-collapsible-open data-[state=closed]:animate-collapsible-closed">
              <p className="text-sm sm:text-base mt-3">
                {productDetails?.description}
              </p>
            </CollapsibleContent>
          </Collapsible>

          {/* Price Section */}
          <div className="flex items-center justify-between">
            <p
              className={`text-xl font-bold text-primary ${
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
              <p className="text-xl font-bold">${productDetails?.salePrice}</p>
            ) : null}
          </div>

          {/* Rating Section */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageRating} />
            </div>
            <span>({averageRating.toFixed(2)})</span>
          </div>

          {/* Add to Cart Button */}
          <div className="my-5">
            <Button
              onClick={() =>
                handleAddToCart(productDetails?._id, productDetails?.totalStock)
              }
              className={`w-full`}
              disabled={productDetails?.totalStock === 0}
            >
              {productDetails?.totalStock === 0
                ? "Out of stock"
                : "Add to cart"}
            </Button>
          </div>

          <Separator />

          {/* Reviews Section */}
          <div className="flex-1 overflow-y-auto pb-3">
            <h2 className="text-lg font-bold my-4 sm:text-xl">Reviews</h2>
            <div className="grid gap-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="flex gap-4">
                    <Avatar className="size-8 border sm:size-10">
                      <AvatarFallback>{review.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{review.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={review.rating} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No reviews yet</p>
              )}
            </div>
          </div>

          {/*  Write Review Section */}
          <div className=" bg-background pt-4 border-t">
            <div className="flex flex-col gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(e) => setReviewMsg(e.target.value)}
                placeholder="Write a review..."
                className="text-sm capitalize"
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
