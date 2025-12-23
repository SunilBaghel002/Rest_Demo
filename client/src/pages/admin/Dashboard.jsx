import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiShoppingBag, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    growthRate: 0
  });

  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await analyticsAPI.getDashboard();
      setStats(response.data.stats);
      setSalesData(response.data.salesData);
    } catch (error) {
      // Mock data for demo
      setStats({
        totalRevenue: 12458.50,
        totalOrders: 156,
        totalCustomers: 89,
        growthRate: 23.5
      });

      setSalesData([
        { day: 'Mon', sales: 1200, orders: 24 },
        { day: 'Tue', sales: 1900, orders: 32 },
        { day: 'Wed', sales: 1500, orders: 28 },
        { day: 'Thu', sales: 2200, orders: 38 },
        { day: 'Fri', sales: 2800, orders: 45 },
        { day: 'Sat', sales: 3200, orders: 52 },
        { day: 'Sun', sales: 2400, orders: 41 },
      ]);
    }
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: FiDollarSign,
      color: 'bg-green-500',
      change: '+12.5%'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: FiShoppingBag,
      color: 'bg-blue-500',
      change: '+8.2%'
    },
    {
      title: 'Customers',
      value: stats.totalCustomers,
      icon: FiUsers,
      color: 'bg-purple-500',
      change: '+15.3%'
    },
    {
      title: 'Growth Rate',
      value: `${stats.growthRate}%`,
      icon: FiTrendingUp,
      color: 'bg-orange-500',
      change: '+5.1%'
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white text-2xl" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-sm font-semibold">{stat.change}</span>
              <span className="text-gray-500 text-sm">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Weekly Sales</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#FF6B6B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Orders Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#4ECDC4" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2">
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Items</th>
                <th className="text-left py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Time</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-semibold">#ORD-{1000 + i}</td>
                  <td className="py-3 px-4">Customer {i}</td>
                  <td className="py-3 px-4">{Math.floor(Math.random() * 5) + 1} items</td>
                  <td className="py-3 px-4 font-bold">${(Math.random() * 50 + 20).toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      i % 3 === 0 ? 'bg-green-100 text-green-700' :
                      i % 3 === 1 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {i % 3 === 0 ? 'Completed' : i % 3 === 1 ? 'Preparing' : 'Pending'}
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