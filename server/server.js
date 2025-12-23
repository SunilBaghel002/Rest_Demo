const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock Database
let menuItems = [
  {
    _id: "1",
    name: "Margherita Pizza",
    description: "Fresh tomatoes, mozzarella, basil",
    price: 12.99,
    category: "Main Course",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400",
    isVeg: true,
    isAvailable: true,
  },
  {
    _id: "2",
    name: "Caesar Salad",
    description: "Romaine lettuce, parmesan, croutons",
    price: 8.99,
    category: "Appetizer",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    isVeg: true,
    isAvailable: true,
  },
];

let orders = [];

// Routes

// Menu Routes
app.get("/api/menu", (req, res) => {
  res.json(menuItems);
});

app.post("/api/menu", (req, res) => {
  const newItem = {
    _id: Date.now().toString(),
    ...req.body,
  };
  menuItems.push(newItem);
  res.status(201).json(newItem);
});

app.put("/api/menu/:id", (req, res) => {
  const { id } = req.params;
  menuItems = menuItems.map((item) =>
    item._id === id ? { ...item, ...req.body } : item
  );
  res.json({ message: "Updated successfully" });
});

app.delete("/api/menu/:id", (req, res) => {
  const { id } = req.params;
  menuItems = menuItems.filter((item) => item._id !== id);
  res.json({ message: "Deleted successfully" });
});

// Order Routes
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

app.post("/api/orders", (req, res) => {
  const newOrder = {
    _id: Date.now().toString(),
    orderNumber: `ORD-${1000 + orders.length}`,
    ...req.body,
    status: "pending",
    createdAt: new Date(),
  };
  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

app.put("/api/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  orders = orders.map((order) =>
    order._id === id ? { ...order, status } : order
  );
  res.json({ message: "Status updated" });
});

// Analytics Route
app.get("/api/analytics/dashboard", (req, res) => {
  const stats = {
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    totalOrders: orders.length,
    totalCustomers: new Set(orders.map((o) => o.customer.phone)).size,
    growthRate: 23.5,
  };

  const salesData = [
    { day: "Mon", sales: 1200, orders: 24 },
    { day: "Tue", sales: 1900, orders: 32 },
    { day: "Wed", sales: 1500, orders: 28 },
    { day: "Thu", sales: 2200, orders: 38 },
    { day: "Fri", sales: 2800, orders: 45 },
    { day: "Sat", sales: 3200, orders: 52 },
    { day: "Sun", sales: 2400, orders: 41 },
  ];

  res.json({ stats, salesData });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
