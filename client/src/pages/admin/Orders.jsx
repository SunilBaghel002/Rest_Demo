import React, { useState, useEffect } from "react";
import { 
  FiClock, 
  FiCheck, 
  FiX, 
  FiPackage,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiFileText,
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
  FiXCircle
} from "react-icons/fi";
import { orderAPI } from "../../services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll();

      // ✅ FIX: Properly handle API response structure
      const ordersData = response.data?.data || response.data || [];

      // Ensure it's an array
      const ordersArray = Array.isArray(ordersData) ? ordersData : [];

      setOrders(ordersArray);
    } catch (error) {
      console.error("Failed to fetch orders:", error);

      // Mock data for demo
      const mockOrders = [
        {
          _id: "1",
          orderNumber: "ORD-1001",
          customer: {
            name: "John Doe",
            phone: "123-456-7890",
            tableNumber: "5",
          },
          items: [
            { name: "Margherita Pizza", quantity: 2, price: 12.99 },
            { name: "Caesar Salad", quantity: 1, price: 8.99 },
          ],
          total: 34.97,
          status: "pending",
          createdAt: new Date(),
          specialInstructions: "Extra cheese please",
        },
        {
          _id: "2",
          orderNumber: "ORD-1002",
          customer: {
            name: "Jane Smith",
            phone: "098-765-4321",
            tableNumber: "3",
          },
          items: [
            { name: "Grilled Chicken", quantity: 1, price: 15.99 },
            { name: "Fresh Lemonade", quantity: 2, price: 3.99 },
          ],
          total: 23.97,
          status: "preparing",
          createdAt: new Date(Date.now() - 600000),
        },
        {
          _id: "3",
          orderNumber: "ORD-1003",
          customer: {
            name: "Bob Johnson",
            phone: "555-123-4567",
            tableNumber: "7",
          },
          items: [
            { name: "Pasta Carbonara", quantity: 1, price: 13.99 },
            { name: "Chocolate Lava Cake", quantity: 1, price: 6.99 },
          ],
          total: 20.98,
          status: "completed",
          createdAt: new Date(Date.now() - 1800000),
        },
      ];
      setOrders(mockOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order ${newStatus}!`);
    } catch (error) {
      // Still update UI even if API fails (for demo)
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order ${newStatus}!`);
    }
  };

  // ✅ Safe filtering with default empty array
  const filteredOrders = Array.isArray(orders)
    ? filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter)
    : [];

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiAlertCircle className="text-yellow-600" />;
      case "preparing":
        return <FiLoader className="text-blue-600 animate-spin" />;
      case "ready":
        return <FiPackage className="text-purple-600" />;
      case "completed":
        return <FiCheckCircle className="text-green-600" />;
      case "cancelled":
        return <FiXCircle className="text-red-600" />;
      default:
        return <FiPackage className="text-gray-600" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-black mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Order Management
        </h1>
        <p className="text-gray-600 flex items-center gap-2">
          <FiPackage className="text-rose-500" />
          Manage and track all customer orders in real-time
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {["all", "pending", "preparing", "ready", "completed", "cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-3 rounded-xl font-bold capitalize whitespace-nowrap transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 ${
                filter === status
                  ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white scale-105 shadow-xl"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center gap-2">
                {getStatusIcon(status)} {status}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    filter === status ? "bg-white/20" : "bg-gray-100"
                  }`}
                >
                  {getOrderCount(status)}
                </span>
              </span>
            </button>
          )
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex justify-between mb-4">
                <div className="bg-gray-200 h-6 w-32 rounded"></div>
                <div className="bg-gray-200 h-8 w-24 rounded-full"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-200 h-32 rounded-xl"></div>
                <div className="bg-gray-200 h-32 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Orders Grid */}
          <div className="grid gap-4 sm:gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border-l-4 border-rose-500"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-gray-800 mb-1">
                        {order.orderNumber}
                      </h3>
                      <p className="text-gray-600 text-sm flex items-center gap-2">
                        <FiClock className="text-rose-500" />
                        {format(new Date(order.createdAt), "PPp")}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-bold capitalize flex items-center gap-2 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Customer Info */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-100 hover:shadow-lg transition-shadow">
                      <h4 className="font-bold mb-4 text-gray-800 flex items-center gap-2">
                        <FiUser className="text-blue-500" /> Customer Details
                      </h4>
                      <div className="space-y-3 text-sm">
                        <p className="flex items-center gap-3 hover:translate-x-1 transition-transform">
                          <FiUser className="text-gray-400 flex-shrink-0" />
                          <span className="font-semibold text-gray-700">Name:</span>
                          <span className="text-gray-800">{order.customer.name}</span>
                        </p>
                        <p className="flex items-center gap-3 hover:translate-x-1 transition-transform">
                          <FiPhone className="text-gray-400 flex-shrink-0" />
                          <span className="font-semibold text-gray-700">Phone:</span>
                          <span className="text-gray-800">{order.customer.phone}</span>
                        </p>
                        {order.customer.email && (
                          <p className="flex items-center gap-3 hover:translate-x-1 transition-transform">
                            <FiMail className="text-gray-400 flex-shrink-0" />
                            <span className="font-semibold text-gray-700">Email:</span>
                            <span className="text-gray-800">{order.customer.email}</span>
                          </p>
                        )}
                        {order.customer.tableNumber && (
                          <p className="flex items-center gap-3 hover:translate-x-1 transition-transform">
                            <FiMapPin className="text-gray-400 flex-shrink-0" />
                            <span className="font-semibold text-gray-700">Table:</span>
                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full font-bold">
                              #{order.customer.tableNumber}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-rose-50 p-5 rounded-xl border border-orange-100 hover:shadow-lg transition-shadow">
                      <h4 className="font-bold mb-4 text-gray-800 flex items-center gap-2">
                        <FiPackage className="text-orange-500" /> Order Items
                      </h4>
                      <div className="space-y-2 text-sm">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center hover:translate-x-1 transition-transform p-2 rounded-lg hover:bg-white/50"
                          >
                            <span className="text-gray-700">
                              <span className="font-bold text-rose-500">
                                {item.quantity}x
                              </span>{" "}
                              {item.name}
                            </span>
                            <span className="font-bold text-gray-800">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        <div className="border-t-2 border-orange-200 pt-3 mt-3 flex justify-between font-bold text-base">
                          <span className="text-gray-800">Total</span>
                          <span className="text-2xl text-rose-500">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {order.specialInstructions && (
                    <div className="mb-6">
                      <h4 className="font-bold mb-2 text-gray-800 flex items-center gap-2">
                        <FiFileText className="text-yellow-500" /> Special Instructions
                      </h4>
                      <p className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm text-gray-700">
                        {order.specialInstructions}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {order.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(order._id, "preparing")
                          }
                          className="btn-secondary flex items-center gap-2 flex-1 sm:flex-none justify-center hover:scale-105 transition-transform"
                        >
                          <FiClock /> Start Preparing
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(order._id, "cancelled")
                          }
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 active:scale-95 hover:scale-105 transition-all shadow-lg flex items-center gap-2 flex-1 sm:flex-none justify-center"
                        >
                          <FiX /> Cancel Order
                        </button>
                      </>
                    )}
                    {order.status === "preparing" && (
                      <button
                        onClick={() => handleStatusChange(order._id, "ready")}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 active:scale-95 hover:scale-105 transition-all shadow-lg flex items-center gap-2 flex-1 sm:flex-none justify-center"
                      >
                        <FiPackage /> Mark as Ready
                      </button>
                    )}
                    {order.status === "ready" && (
                      <button
                        onClick={() =>
                          handleStatusChange(order._id, "completed")
                        }
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 active:scale-95 hover:scale-105 transition-all shadow-lg flex items-center gap-2 flex-1 sm:flex-none justify-center"
                      >
                        <FiCheck /> Mark as Completed
                      </button>
                    )}
                    {(order.status === "completed" ||
                      order.status === "cancelled") && (
                      <div className="text-gray-500 italic text-sm flex items-center gap-2">
                        <FiCheckCircle />
                        This order has been {order.status}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-20">
              <div className="flex justify-center mb-6">
                <FiPackage className="text-9xl text-gray-300" />
              </div>
              <p className="text-gray-500 text-2xl font-semibold mb-4">
                No {filter} orders found
              </p>
              <p className="text-gray-400 mb-8">
                {filter === "all"
                  ? "No orders have been placed yet"
                  : `There are no ${filter} orders at the moment`}
              </p>
              {filter !== "all" && (
                <button onClick={() => setFilter("all")} className="btn-outline">
                  View All Orders
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;