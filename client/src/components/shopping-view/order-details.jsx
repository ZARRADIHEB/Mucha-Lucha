import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Badge } from "../ui/badge";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { IoMdTime } from "react-icons/io";
import { MdDone } from "react-icons/md";
import { Button } from "../ui/button";
import { ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const ShoppingOrderDetailsView = ({ orderDetails, openDetailsDialog }) => {
  const { user } = useSelector((state) => state.auth);
  const [isOpenOrderDescription, setIsOpenOrderDescription] = useState(false);

  useEffect(() => {
    if (!openDetailsDialog) {
      setIsOpenOrderDescription(false);
    }
  }, [openDetailsDialog]);

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
      <VisuallyHidden>
        <DialogTitle>Order Details</DialogTitle>
      </VisuallyHidden>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="mt-6 flex justify-between items-center">
            <p className="font-extrabold">Order ID</p>
            <Label>{orderDetails?._id}</Label>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="font-extrabold">Order Date</p>
            <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="font-extrabold">Order Total Amount</p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>

          <div className="mt-2 flex justify-between items-center">
            <p className="font-extrabold">Payment Method</p>
            <Label>{orderDetails?.paymentMethod}</Label>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="font-extrabold">Payment Status</p>
            <Label className="flex items-center gap-2">
              {orderDetails?.paymentStatus === "Paid" ? (
                <MdDone size={19} className="text-green-500" />
              ) : (
                <IoMdTime size={19} className="text-yellow-500" />
              )}
              {orderDetails?.paymentStatus}
            </Label>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="font-extrabold">Order Status</p>
            <Label className="flex items-center gap-2">
              <Badge
                className={
                  orderDetails?.orderStatus === "Confirmed" ||
                  orderDetails?.orderStatus === "Delivered"
                    ? "bg-green-500"
                    : orderDetails?.orderStatus === "Rejected"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }
              >
                {orderDetails?.orderStatus}
              </Badge>
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="font-extrabold">Order Details</div>
          <Collapsible
            open={isOpenOrderDescription}
            onOpenChange={setIsOpenOrderDescription}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 transition-all duration-300 ease-in-out"
              >
                <span className="text-muted-foreground">
                  {isOpenOrderDescription
                    ? "Click to hide order details"
                    : "Click to view order details"}
                </span>
                <ChevronsUpDown className="size-4 text-muted-foreground" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="CollapsibleContent transition-all duration-300 ease-in-out overflow-hidden data-[state=open]:animate-collapsible-open data-[state=closed]:animate-collapsible-closed">
              <ul className="grid gap-3">
                {orderDetails?.cartItems.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between border-b pb-3 items-center"
                  >
                    <span>{item.title}</span>
                    <span className="flex items-center gap-2 flex-col">
                      <span className="font-extrabold ">
                        Price: ${item.price}
                      </span>

                      <span className="ml-2 font-extrabold ">
                        Quantity: {item.quantity}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-extrabold">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user?.userName}</span>
              <span>{orderDetails?.addressInfo.address}</span>
              <span>{orderDetails?.addressInfo.city}</span>
              <span>{orderDetails?.addressInfo.zipcode}</span>
              <span>{orderDetails?.addressInfo.phone}</span>
              <span>{orderDetails?.addressInfo.notes}</span>
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
    paymentMethod: PropTypes.string,
    paymentStatus: PropTypes.string,
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
  openDetailsDialog: PropTypes.bool,
};

export default ShoppingOrderDetailsView;
