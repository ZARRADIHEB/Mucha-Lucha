import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { useState } from "react";
import PropTypes from "prop-types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";

const initialFormData = {
  status: "",
};

const AdminOrdersDetailsView = ({ orderDetails }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [isOpenOrderDetails, setIsOpenOrderDetails] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const handleUpdateOrderStatus = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
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
            <p className="font-medium"></p>
            <Label>${orderDetails?.totalAmount}</Label>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="font-extrabold">Order Status</p>
            <Label className="flex items-center gap-2">
              <Badge
                className={
                  orderDetails?.orderStatus === "confirmed"
                    ? "bg-green-500"
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
            open={isOpenOrderDetails}
            onOpenChange={setIsOpenOrderDetails}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="mb-4 transition-all duration-300 ease-in-out"
              >
                <span className="text-muted-foreground">
                  {isOpenOrderDetails
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
                  <li key={item._id} className="flex justify-between">
                    <span>{item.title}</span>
                    <span>
                      <span className="font-extrabold">Price:</span> $
                      {item.price}
                      <span className="ml-2 font-extrabold">
                        Quantity:
                      </span>{" "}
                      {item.quantity}
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
        <div>
          <CommonForm
            formControls={[
              {
                label: "Order Status",
                name: "status",
                componentType: "select",
                options: [
                  { id: "In Process", label: "in-process" },
                  { id: "Out for Delivery", label: "out-for-delivery" },
                  { id: "Shipping", label: "shipping" },
                  { id: "Delivered", label: "delivered" },
                  { id: "Canceled", label: "canceled" },
                ],
              },
            ]}
            formdata={formData}
            setFormData={setFormData}
            buttonText="Update Order Status"
            onSubmit={handleUpdateOrderStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
};

AdminOrdersDetailsView.propTypes = {
  orderDetails: PropTypes.shape({
    _id: PropTypes.string,
    orderDate: PropTypes.string,
    totalAmount: PropTypes.number,
    orderStatus: PropTypes.string,
    cartItems: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
        price: PropTypes.number,
        quantity: PropTypes.number,
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

export default AdminOrdersDetailsView;
