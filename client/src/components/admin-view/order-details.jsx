import { IoMdTime } from "react-icons/io";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import CommonForm from "../common/form";
import { useState } from "react";

const initialFormData = {
  status: "",
};

const AdminOrdersDetailsView = () => {
  const [formData, setFormData] = useState(initialFormData);

  const handleUpdateOrderStatus = (e) => {
    e.preventDefault();
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="mt-6 flex justify-between items-center">
            <p className="font-medium">Order ID</p>
            <Label>123456</Label>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="font-medium">Order Date</p>
            <Label>17/02/2025</Label>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="font-medium">Order Price</p>
            <Label>$1540</Label>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <p className="font-medium">Order Status</p>
            <Label className="flex items-center gap-2">
              In Process
              <IoMdTime size={17} className="text-yellow-500" />
            </Label>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
              <li className="flex items-center justify-between">
                <span>Product One</span>
                <span>$1044</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>iZ17</span>
              <span>Address</span>
              <span>City</span>
              <span>Zipcode</span>
              <span>Phone</span>
              <span>Notes</span>
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

export default AdminOrdersDetailsView;
