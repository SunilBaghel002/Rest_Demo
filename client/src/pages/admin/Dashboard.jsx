import React, { useState, useEffect } from "react";
import {
  FiDollarSign,
  FiShoppingBag,
  FiUsers,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
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
      // Mock data for demo
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

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: FiDollarSign,
      gradient: "from-green-400 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50",
      change: "+12.5%",
      changePositive: true,
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: FiShoppingBag,
      gradient: "from-blue-400 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      change: "+8.2%",
      changePositive: true,
    },
    {
      title: "Customers",
      value: stats?.totalCustomers || 0,
      icon: FiUsers,
      gradient: "from-purple-400 to-pink-600",
      bgGradient: "from-purple-50 to-pink-50",
      change: "+15.3%",
      changePositive: true,
    },
    {
      title: "Growth Rate",
      value: `${(stats?.growthRate || 0).toFixed(1)}%`,
      icon: FiTrendingUp,
      gradient: "from-orange-400 to-rose-600",
      bgGradient: "from-orange-50 to-rose-50",
      change: "+5.1%",
      changePositive: true,
    },
  ];

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <FiCheckCircle className="text-green-500" />;
      case "Preparing":
        return <FiClock className="text-yellow-500" />;
      case "Pending":
        return <FiAlertCircle className="text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 mx-64">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-black mb-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 flex items-center gap-2">
          <FiTrendingUp className="text-green-500" />
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-24 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer bg-gradient-to-br ${stat.bgGradient} border border-white`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm mb-2 font-semibold">
                      {stat.title}
                    </p>
                    <h3 className="text-3xl sm:text-4xl font-black text-gray-800">
                      {stat.value}
                    </h3>
                  </div>
                  <div
                    className={`p-4 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg transform hover:rotate-12 transition-transform duration-300`}
                  >
                    <stat.icon className="text-white text-2xl" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-bold flex items-center gap-1 ${
                      stat.changePositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <FiTrendingUp
                      className={stat.changePositive ? "" : "rotate-180"}
                    />
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm">vs last week</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Sales Chart */}
        <div className="card hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-rose-400 to-pink-600 rounded-xl">
              <FiDollarSign className="text-white text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Weekly Sales</h2>
          </div>
          {loading ? (
            <div className="h-[300px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl animate-pulse"></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <defs>
                  <linearGradient
                    id="salesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#fb7185" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "2px solid #f43f5e",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="sales"
                  fill="url(#salesGradient)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Orders Chart */}
        <div className="card hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-xl">
              <FiShoppingBag className="text-white text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Orders Trend</h2>
          </div>
          {loading ? (
            <div className="h-[300px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl animate-pulse"></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <defs>
                  <linearGradient
                    id="ordersGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "2px solid #14b8a6",
                    borderRadius: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="url(#ordersGradient)"
                  strokeWidth={3}
                  dot={{
                    fill: "#14b8a6",
                    r: 6,
                    strokeWidth: 2,
                    stroke: "#fff",
                  }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl">
            <FiShoppingBag className="text-white text-xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="text-left py-4 px-4 font-bold text-gray-700">
                  Order ID
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">
                  Customer
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">
                  Items
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">
                  Total
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">
                  Status
                </th>
                <th className="text-left py-4 px-4 font-bold text-gray-700">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => {
                const statusOptions = ["Completed", "Preparing", "Pending"];
                const status = statusOptions[i % 3];
                return (
                  <tr
                    key={i}
                    className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200"
                  >
                    <td className="py-4 px-4 font-bold text-gray-800">
                      #ORD-{1000 + i}
                    </td>
                    <td className="py-4 px-4 text-gray-700 flex items-center gap-2">
                      <FiUser className="text-gray-400" />
                      Customer {i}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {Math.floor(Math.random() * 5) + 1} items
                    </td>
                    <td className="py-4 px-4 font-bold text-rose-500">
                      ${(Math.random() * 50 + 20).toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 w-fit ${
                          i % 3 === 0
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : i % 3 === 1
                            ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                            : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {getOrderStatusIcon(status)}
                        {status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600 flex items-center gap-2">
                      <FiClock className="text-gray-400" />
                      {i * 5} min ago
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
