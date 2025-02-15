import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import PropTypes from "prop-types";

const ShoppingProductTile = ({
  product,
  handleGetProductDetails,
  handleAddToCart,
}) => {
  return (
    <Card className="w-full max-w-sm mx-auto cursor-pointer">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />

          {product?.salePrice > 0 && product?.totalStock !== 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 ">
              <span className="mr-2">Sale </span>
              <span>
                -
                {(
                  ((product.price - product.salePrice) / product.price) *
                  100
                ).toFixed(0)}
                %
              </span>
            </Badge>
          ) : null}

          {product?.totalStock === 0 && (
            <Badge className="absolute top-2 left-2 bg-gray-500 hover:bg-gray-600 animate-in">
              <span>Out Of Stock</span>
            </Badge>
          )}

          {product?.totalStock <= 10 && product?.totalStock >= 1 ? (
            <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600 animate-pulse">
              <span>Only {product?.totalStock} Left</span>
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {`${product?.category[0].toUpperCase()}${product?.category.slice(
                1
              )}`}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {`${product?.brand[0].toUpperCase()}${product?.brand.slice(1)}`}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.price > 0 &&
                product?.salePrice &&
                product?.totalStock !== 0
                  ? "line-through text-muted-foreground"
                  : "text-lg text-primary font-semibold"
              } `}
            >
              ${product?.price}
            </span>
            {product?.salePrice && product?.totalStock !== 0 ? (
              <span className="text-lg text-primary font-semibold">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        <Button
          disabled={product?.totalStock === 0}
          onClick={() => handleAddToCart(product._id)}
          className={`w-full ${product?.totalStock === 0 ? "hidden" : ""}`}
        >
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
};

ShoppingProductTile.propTypes = {
  handleAddToCart: PropTypes.func.isRequired,
  product: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.string,
    title: PropTypes.string,
    category: PropTypes.string,
    brand: PropTypes.string,
    price: PropTypes.number,
    salePrice: PropTypes.number,
    totalStock: PropTypes.number,
  }).isRequired,
  handleGetProductDetails: PropTypes.func.isRequired,
};

export default ShoppingProductTile;
