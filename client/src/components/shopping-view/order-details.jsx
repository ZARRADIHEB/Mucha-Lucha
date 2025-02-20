import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

const ShoppingOrderDetailsView = ({ orderDetails }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="mt-6 flex justify-between items-center">
            <p className="font-medium">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="font-medium">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="font-medium">Order Price</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="font-medium">Order Status</p>
            <Label className="flex items-center gap-2">
              <Badge
                className={`${
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
                    : "bg-yellow-500"
                }`}
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-5">
              {orderDetails &&
              orderDetails?.cartItems &&
              orderDetails?.cartItems.length > 0
                ? orderDetails?.cartItems.map((item) => (
                    <>
                      <li
                        key={item._id}
                        className="flex items-center justify-between"
                      >
                        <span>{item.title}</span>
                        <span className="flex flex-col items-end gap-1">
                          <span>
                            {" "}
                            <span className="font-extrabold">Price:</span> $
                            {item.price}
                          </span>
                          <span>
                            <span className="font-extrabold">Quantity:</span>{" "}
                            {item.quantity}
                          </span>
                        </span>
                      </li>
                    </>
                  ))
                : null}
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user?.userName}</span>
              <span>{orderDetails?.addressInfo?.address}</span>
              <span>{orderDetails?.addressInfo?.city}</span>
              <span>{orderDetails?.addressInfo?.zipcode}</span>
              <span>{orderDetails?.addressInfo?.phone}</span>
              <span>{orderDetails?.addressInfo?.notes}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};
ShoppingOrderDetailsView.propTypes = {
  orderDetails: PropTypes.shape({
    _id: PropTypes.string,
    orderDate: PropTypes.string,
    totalAmount: PropTypes.number,
    orderStatus: PropTypes.string,
    cartItems: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
        quantity: PropTypes.number,
        price: PropTypes.number,
      })
    ),
    addressInfo: PropTypes.shape({
      address: PropTypes.string,
      city: PropTypes.string,
      zipcode: PropTypes.string,
      phone: PropTypes.string,
      notes: PropTypes.string,
    }),
  }),
};

export default ShoppingOrderDetailsView;
