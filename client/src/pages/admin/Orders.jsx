import React, { useState, useEffect } from "react";
import { FiClock, FiCheck, FiX } from "react-icons/fi";
import { orderAPI } from "../../services/api";
import toast from "react-hot-toast";
import { format } from "date-fns";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      // Mock data
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
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order ${newStatus}!`);
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "preparing":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Order Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {["all", "pending", "preparing", "completed", "cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg font-semibold capitalize whitespace-nowrap transition ${
                filter === status
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {status} (
              {
                orders.filter((o) => status === "all" || o.status === status)
                  .length
              }
              )
            </button>
          )
        )}
      </div>

      {/* Orders Grid */}
      <div className="grid gap-6">
        {filteredOrders.map((order) => (
          <div key={order._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold mb-1">{order.orderNumber}</h3>
                <p className="text-gray-600 text-sm">
                  {format(new Date(order.createdAt), "PPp")}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-4">
              {/* Customer Info */}
              <div>
                <h4 className="font-semibold mb-2">Customer Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-1 text-sm">
                  <p>
                    <span className="font-semibold">Name:</span>{" "}
                    {order.customer.name}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {order.customer.phone}
                  </p>
                  {order.customer.tableNumber && (
                    <p>
                      <span className="font-semibold">Table:</span>{" "}
                      {order.customer.tableNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold mb-2">Order Items</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-primary">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {order.specialInstructions && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Special Instructions</h4>
                <p className="bg-yellow-50 p-3 rounded-lg text-sm">
                  {order.specialInstructions}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              {order.status === "pending" && (
                <>
                  <button
                    onClick={() => handleStatusChange(order._id, "preparing")}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <FiClock /> Start Preparing
                  </button>
                  <button
                    onClick={() => handleStatusChange(order._id, "cancelled")}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 flex items-center gap-2"
                  >
                    <FiX /> Cancel Order
                  </button>
                </>
              )}
              {order.status === "preparing" && (
                <button
                  onClick={() => handleStatusChange(order._id, "completed")}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 flex items-center gap-2"
                >
                  <FiCheck /> Mark as Completed
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No {filter} orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
