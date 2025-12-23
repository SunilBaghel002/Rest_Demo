import React, { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { analyticsAPI } from "../../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    growthRate: 0,
  });

  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getDashboard();

      // ✅ Fixed: Properly handle the response structure
      if (response.data && response.data.data) {
        setStats(
          response.data.data.stats || {
            totalRevenue: 0,
            totalOrders: 0,
            totalCustomers: 0,
            growthRate: 0,
          }
        );
        setSalesData(response.data.data.salesData || []);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      // Mock data for demo when API fails
      setStats({
        totalRevenue: 12458.5,
        totalOrders: 156,
        totalCustomers: 89,
        growthRate: 23.5,
      });

      setSalesData([
        { day: "Mon", sales: 1200, orders: 24 },
        { day: "Tue", sales: 1900, orders: 32 },
        { day: "Wed", sales: 1500, orders: 28 },
        { day: "Thu", sales: 2200, orders: 38 },
        { day: "Fri", sales: 2800, orders: 45 },
        { day: "Sat", sales: 3200, orders: 52 },
        { day: "Sun", sales: 2400, orders: 41 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Use optional chaining to prevent errors
  const statCards = [
    {
      title: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: FiDollarSign,
      color: "bg-gradient-to-br from-green-400 to-green-600",
      change: "+12.5%",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: FiShoppingBag,
      color: "bg-gradient-to-br from-blue-400 to-blue-600",
      change: "+8.2%",
    },
    {
      title: "Customers",
      value: stats?.totalCustomers || 0,
      icon: FiUsers,
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
      change: "+15.3%",
    },
    {
      title: "Growth Rate",
      value: `${(stats?.growthRate || 0).toFixed(1)}%`,
      icon: FiTrendingUp,
      color: "bg-gradient-to-br from-orange-400 to-orange-600",
      change: "+5.1%",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="card hover:scale-105 transition-transform duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {stat.value}
                  </h3>
                </div>
                <div className={`${stat.color} p-3 rounded-xl shadow-lg`}>
                  <stat.icon className="text-white text-xl sm:text-2xl" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-sm font-semibold">
                  {stat.change}
                </span>
                <span className="text-gray-500 text-sm">vs last week</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Sales Chart */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Weekly Sales</h2>
          {loading ? (
            <div className="h-[300px] bg-gray-100 rounded-lg animate-pulse"></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "2px solid #f43f5e",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#f43f5e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Orders Chart */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Orders Trend</h2>
          {loading ? (
            <div className="h-[300px] bg-gray-100 rounded-lg animate-pulse"></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "2px solid #14b8a6",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  dot={{ fill: "#14b8a6", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-bold text-gray-700">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">
                  Items
                </th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">
                  Total
                </th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    #ORD-{1000 + i}
                  </td>
                  <td className="py-3 px-4 text-gray-700">Customer {i}</td>
                  <td className="py-3 px-4 text-gray-700">
                    {Math.floor(Math.random() * 5) + 1} items
                  </td>
                  <td className="py-3 px-4 font-bold text-rose-500">
                    ${(Math.random() * 50 + 20).toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        i % 3 === 0
                          ? "bg-green-100 text-green-700"
                          : i % 3 === 1
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {i % 3 === 0
                        ? "Completed"
                        : i % 3 === 1
                        ? "Preparing"
                        : "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{i * 5} min ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
