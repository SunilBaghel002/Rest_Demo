import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  FiHome,
  FiMenu as FiMenuIcon,
  FiShoppingBag,
  FiLogOut,
  FiX,
} from "react-icons/fi";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { path: "/admin/dashboard", icon: FiHome, label: "Dashboard" },
    { path: "/admin/menu", icon: FiMenuIcon, label: "Menu Management" },
    { path: "/admin/orders", icon: FiShoppingBag, label: "Orders" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-dark text-white w-64 fixed h-full z-50 transition-transform lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">🍽️ Admin Panel</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden"
            >
              <FiX className="text-2xl" />
            </button>
          </div>
        </div>

        <nav className="p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-4 rounded-lg mb-2 transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon className="text-xl" />
              <span className="font-semibold">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button className="flex items-center gap-3 p-4 rounded-lg w-full text-gray-300 hover:bg-gray-700 transition">
            <FiLogOut className="text-xl" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-md p-4 sticky top-0 z-40">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-2xl"
            >
              <FiMenuIcon />
            </button>
            <div className="flex items-center gap-4">
              <a href="/" className="text-primary hover:underline">
                View Customer Site
              </a>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
                <span className="font-semibold">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main
          className="overflow-y-auto"
          style={{ height: "calc(100vh - 73px)" }}
        >
          <Outlet />
        </main>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
