import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog } from "../ui/dialog";
import { useEffect, useState } from "react";
import AdminOrdersDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

const AdminOrdersView = () => {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { ordersList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  const handleFetchOrderDetails = (orderId) => {
    dispatch(getOrderDetailsForAdmin(orderId));
  };

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  return (
    <Card className="w-full max-w-[90vw] md:max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Id</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersList.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order.orderDate.split("T")[0]}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      order?.orderStatus === "Confirmed" ||
                      order?.orderStatus === "Delivered"
                        ? "bg-green-500"
                        : order?.orderStatus === "Rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }
                  >
                    {order.orderStatus}
                  </Badge>
                </TableCell>
                <TableCell>${order.totalAmount}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      handleFetchOrderDetails(order._id);
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            <Dialog
              open={openDetailsDialog}
              onOpenChange={() => {
                setOpenDetailsDialog(false);
                dispatch(resetOrderDetails());
              }}
            >
              <AdminOrdersDetailsView orderDetails={orderDetails} />
            </Dialog>

            {ordersList.length === 0 && (
              <TableRow>
                <TableCell colSpan="5">No orders found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminOrdersView;
