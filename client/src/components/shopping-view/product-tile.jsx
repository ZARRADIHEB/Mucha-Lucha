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
            className="w-full h-[300px] object-fill rounded-t-lg"
          />

          {product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
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
                product?.price > 0 && product?.salePrice
                  ? "line-through text-muted-foreground"
                  : "text-lg text-primary font-semibold"
              } `}
            >
              ${product?.price}
            </span>
            {product?.salePrice ? (
              <span className="text-lg text-primary font-semibold">
                ${product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        <Button onClick={() => handleAddToCart(product._id)} className="w-full">
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
  }).isRequired,
  handleGetProductDetails: PropTypes.func.isRequired,
};

export default ShoppingProductTile;
