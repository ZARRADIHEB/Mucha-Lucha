import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { getSearchResult, resetSearchResult } from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useSearchParams } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const SearchProducts = () => {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  // const [, setSearchParams] = useSearchParams();

  const { searchResult } = useSelector((state) => state.shopSearch);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productDetails } = useSelector((state) => state.shopProducts);

  const dispatch = useDispatch();

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

  const handleGetProductDetails = (getCurrentProductId) => {
    dispatch(fetchProductDetails(getCurrentProductId));
  };

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length >= 3) {
      setTimeout(() => {
        dispatch(getSearchResult(keyword));
      }, 1000);
    } else {
      dispatch(resetSearchResult());
    }
  }, [keyword, dispatch]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center relative">
          <Input
            placeholder=" "
            className="w-full"
            style={{
              fontSize: "1rem",
              textAlign: "center",
              paddingLeft: "2rem",
              position: "relative",
              borderRadius: "0.5rem",
              textTransform: "capitalize",
            }}
            value={keyword}
            name="keyword"
            onChange={(e) => setKeyword(e.target.value)}
          />

          {!keyword.trim() && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            >
              <TypeAnimation
                sequence={[
                  'Search "Nike"',
                  1000,
                  'Search "Puma"',
                  1000,
                  'Search "Adidas"',
                  1000,
                  'Search "H&M"',
                  1000,
                  'Search "Zara"',
                  1000,
                  'Search "Levis"',
                  1000,
                  'Search "Mens Watch"',
                  1000,
                  'Search "Women\'s  Sandals"',
                  1000,
                  'Search "Kids Jacket"',
                  1000,
                  'Search "Mens Hoodie"',
                  1000,
                  'Search "Women\'s  Skirt"',
                  1000,
                  'Search "Kids Cap"',
                  1000,
                  'Search "Mens Shoes"',
                  1000,
                  'Search "Women\'s  Blouse"',
                  1000,
                  'Search "Kids Shorts"',
                  1000,
                  'Search "Mens Belt"',
                  1000,
                  'Search "Women\'s  Sunglasses"',
                  1000,
                  'Search "Kids Socks"',
                  1000,
                  'Search "Mens Jacket"',
                  1000,
                  'Search "Women\'s  Heels"',
                  1000,
                  'Search "Kids T-Shirt"',
                  1000,
                  'Search "Mens Shorts"',
                  1000,
                  'Search "Women\'s  Jeans"',
                  1000,
                  'Search "Kids Dress"',
                  1000,
                  'Search "Mens Socks"',
                  1000,
                  'Search "Women\'s  Scarf"',
                  1000,
                  'Search "Kids Shoes"',
                  1000,
                ]}
                wrapper="span"
                speed={50}
                style={{
                  fontSize: "1rem",
                  color: "#9CA3AF",
                }}
                repeat={Infinity}
              />
            </div>
          )}
        </div>
      </div>
      {!searchResult.length ? (
        <h1 className="text-5xl font-extrabold text-center">
          No Products Found
        </h1>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {searchResult.length &&
            searchResult.map((item) => (
              <ShoppingProductTile
                key={item._id}
                product={item}
                handleAddToCart={handleAddToCart}
                handleGetProductDetails={handleGetProductDetails}
              />
            ))}
        </div>
      )}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        user={user}
      />
    </div>
  );
};

export default SearchProducts;
