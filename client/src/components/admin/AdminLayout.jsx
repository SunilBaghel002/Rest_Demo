import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiMenu as FiMenuIcon,
  FiShoppingBag,
  FiLogOut,
  FiX,
  FiExternalLink,
  FiSettings,
} from "react-icons/fi";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    {
      path: "/admin/dashboard",
      icon: FiHome,
      label: "Dashboard",
      color: "from-blue-500 to-cyan-500",
    },
    {
      path: "/admin/menu",
      icon: FiMenuIcon,
      label: "Menu Management",
      color: "from-orange-500 to-rose-500",
    },
    {
      path: "/admin/orders",
      icon: FiShoppingBag,
      label: "Orders",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 text-white w-64 fixed h-full z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo/Header */}
        <div className="p-6 border-b border-slate-700 bg-slate-900/50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
                🍽️ Admin Panel
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Restaurant Management
              </p>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-4 rounded-xl mb-1 transition-all duration-300 group ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg scale-105`
                      : "text-gray-300 hover:bg-slate-700/50 hover:translate-x-1"
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <item.icon className="text-xl flex-shrink-0" />
                <span className="font-semibold">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Settings Link */}
          <div className="mt-8 pt-4 border-t border-slate-700">
            <button className="flex items-center gap-3 p-4 rounded-xl w-full text-gray-300 hover:bg-slate-700/50 transition-all duration-300 hover:translate-x-1">
              <FiSettings className="text-xl" />
              <span className="font-semibold">Settings</span>
            </button>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-4 rounded-xl w-full text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 group"
          >
            <FiLogOut className="text-xl group-hover:rotate-12 transition-transform" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Top Header Bar */}
        <header className="bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-40 border-b border-gray-200">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <FiMenuIcon className="text-2xl text-gray-700" />
              </button>

              {/* Desktop Logo */}
              <div className="hidden lg:block">
                <h1 className="text-xl font-bold text-gray-800">
                  Restaurant Dashboard
                </h1>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3 sm:gap-4">
                <a
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-2 text-rose-500 hover:text-rose-600 font-semibold transition-colors group"
                >
                  <FiExternalLink className="group-hover:rotate-12 transition-transform" />
                  <span>View Site</span>
                </a>

                {/* Admin Profile */}
                <div className="flex items-center gap-3 bg-gradient-to-r from-rose-50 to-orange-50 px-4 py-2 rounded-xl border border-rose-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    A
                  </div>
                  <div className="hidden sm:block">
                    <p className="font-bold text-gray-800 text-sm">Admin</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
