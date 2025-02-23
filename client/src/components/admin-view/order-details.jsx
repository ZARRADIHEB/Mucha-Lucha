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
import { useDispatch } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { toast } from "@/hooks/use-toast";
import { MdDone } from "react-icons/md";
import { IoMdTime } from "react-icons/io";

const initialFormData = {
  status: "",
};

const AdminOrdersDetailsView = ({ orderDetails }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [isOpenOrderDetails, setIsOpenOrderDetails] = useState(false);

  const dispatch = useDispatch();

  const handleUpdateOrderStatus = (e) => {
    e.preventDefault();
    const { status } = formData;

    dispatch(
      updateOrderStatus({
        orderId: orderDetails._id,
        orderStatus: status,
      })
    ).then((data) => {
      if (data.payload.success) {
        dispatch(getOrderDetailsForAdmin(orderDetails?._id));
        dispatch(getAllOrdersForAdmin());
        setFormData(initialFormData);
        toast({
          title: data.payload.message,
          className: "bg-green-500",
        });
      }
    });
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
              <span>{orderDetails?.addressInfo.userName}</span>
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
                  { id: "In-process", label: "In Process" },
                  { id: "Out-for-delivery", label: "Out For Delivery" },
                  { id: "Shipping", label: "Shipping" },
                  { id: "Delivered", label: "Delivered" },
                  { id: "Rejected", label: "Rejected" },
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
    paymentStatus: PropTypes.string,
    paymentMethod: PropTypes.string,
    cartItems: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
        price: PropTypes.number,
        quantity: PropTypes.number,
      })
    ),
    addressInfo: PropTypes.shape({
      userName: PropTypes.string,
      address: PropTypes.string,
      city: PropTypes.string,
      zipcode: PropTypes.string,
      phone: PropTypes.string,
      notes: PropTypes.string,
    }),
  }),
};

export default AdminOrdersDetailsView;
