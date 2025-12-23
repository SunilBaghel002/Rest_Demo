import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Customer Pages
import Menu from "./pages/customer/Menu";
import Cart from "./pages/customer/Cart";

// Admin Pages
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/DashBoard";
import MenuManagement from "./pages/admin/MenuManagement";
import Orders from "./pages/admin/Orders";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/order-confirmation"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="card max-w-md text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
                <p className="text-gray-600 mb-6">
                  Your order has been received and is being prepared. We'll
                  notify you when it's ready!
                </p>
                <a href="/" className="btn-primary inline-block">
                  Back to Menu
                </a>
              </div>
            </div>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
