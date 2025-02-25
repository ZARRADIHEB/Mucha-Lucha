import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";
import { getAllUsers } from "@/store/auth-slice";
import { getAllReviews } from "@/store/shop/review-slice";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { ordersList } = useSelector((state) => state.adminOrder);
  const { allUsers } = useSelector((state) => state.auth);
  const { allReviews } = useSelector((state) => state.shopReview);

  const dispatch = useDispatch();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const revenueByMonth = ordersList.reduce((acc, order) => {
    const date = new Date(order.orderDate);
    const monthIndex = date.getMonth();
    const month = monthNames[monthIndex];

    acc[month] = (acc[month] || 0) + order.totalAmount;
    return acc;
  }, {});

  const revenueData = monthNames.map((month) => ({
    month,
    revenue: revenueByMonth[month] || 0,
  }));

  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();
  const previousMonthIndex = currentMonthIndex - 1;

  const currentMonthRevenue =
    revenueData.find((data) => data.month === monthNames[currentMonthIndex])
      ?.revenue || 0;
  const previousMonthRevenue =
    revenueData.find((data) => data.month === monthNames[previousMonthIndex])
      ?.revenue || 0;

  let growthPercentage = 0;
  if (previousMonthRevenue > 0) {
    growthPercentage =
      ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) *
      100;
  } else if (currentMonthRevenue > 0) {
    growthPercentage = 100;
  }

  const growthText =
    growthPercentage >= 0
      ? `+${growthPercentage.toFixed(2)}%`
      : `${growthPercentage.toFixed(2)}%`;

  const calculateUserGrowth = (users) => {
    const userCountByMonth = {};

    users.forEach((user) => {
      const date = new Date(
        parseInt(user._id.toString().slice(0, 8), 16) * 1000
      );
      const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!userCountByMonth[yearMonth]) {
        userCountByMonth[yearMonth] = 0;
      }
      userCountByMonth[yearMonth]++;
    });

    // Get current and previous month
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }`;
    const previousMonth = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;

    const currentMonthUsers = userCountByMonth[currentMonth] || 0;
    const previousMonthUsers = userCountByMonth[previousMonth] || 0;

    let userGrowthPercentage = 0;
    if (previousMonthUsers > 0) {
      userGrowthPercentage =
        ((currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100;
    } else if (currentMonthUsers > 0) {
      userGrowthPercentage = 100;
    }

    return userGrowthPercentage.toFixed(2);
  };

  useEffect(() => {
    if (!allUsers.length) {
      dispatch(getAllUsers());
    }
    if (!ordersList.length) {
      dispatch(getAllOrdersForAdmin());
    }
    if (!allReviews.length) {
      dispatch(getAllReviews());
    }
  }, [dispatch, allUsers.length, ordersList.length, allReviews.length]);

  return (
    <div className="min-h-screen max-w-full">
      <div className="grid gap-4 p-4 grid-cols-1 sm:grid-cols-2 ">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {ordersList && ordersList.length
                ? ordersList.reduce((acc, order) => acc + order.totalAmount, 0)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {growthText} from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <span className="text-2xl">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allUsers && allUsers.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {calculateUserGrowth(allUsers)}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <div className="p-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#6b7280" }}
                />
                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={{ stroke: "#6b7280" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000", // Black background for dark mode
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    fontSize: 14,
                  }}
                  labelStyle={{ color: "#fff" }} // White label text
                  itemStyle={{ color: "#fff" }} // White item text
                  formatter={(value) => `$${value}`} // Prepend a dollar sign to revenue
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: "#6366f1", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Latest Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">
                      Order ID
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm">
                      Customer
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm">Amount</TableHead>
                    <TableHead className="text-xs sm:text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersList.slice(-3).map((order) => (
                    <TableRow key={order._id} className="text-center">
                      <TableCell className="text-xs sm:text-sm">
                        {order._id}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        {order.addressInfo.userName}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        ${order.totalAmount}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">
                      Customer Name
                    </TableHead>
                    <TableHead className="text-xs sm:text-sm">Rating</TableHead>
                    <TableHead className="text-xs sm:text-sm">
                      Comment
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allReviews.slice(-3).map((review) => (
                    <TableRow key={review._id}>
                      <TableCell className="text-xs sm:text-sm">
                        {review.userName}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm text-yellow-500">
                        {"★".repeat(review.rating)}
                      </TableCell>
                      <TableCell className="text-xs sm:text-sm">
                        {review.reviewMessage}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
