import React, { useState, useEffect } from "react";
import { FiShoppingCart, FiSearch, FiPlus, FiMinus, FiX } from "react-icons/fi";
import { useStore } from "../../store/useStore";
import { menuAPI } from "../../services/api";
import toast from "react-hot-toast";
import QRCode from "react-qr-code";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(true);

  const { cart, addToCart, getCartTotal } = useStore();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getAll();
      setMenuItems(response.data.data);
      setFilteredItems(response.data.data);
    } catch (error) {
      toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  useEffect(() => {
    let filtered = menuItems;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [selectedCategory, searchTerm, menuItems]);

  const handleAddToCart = (item) => {
    addToCart(item);
    toast.success(
      <div className="flex items-center gap-3">
        <img
          src={item.image}
          alt=""
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div>
          <p className="font-semibold">{item.name}</p>
          <p className="text-sm text-gray-600">Added to cart</p>
        </div>
      </div>,
      { duration: 2000 }
    );
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b-2 border-rose-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                🍽️ Delicious Bites
              </h1>
              <p className="text-gray-600 text-sm mt-1 hidden sm:block">
                Fresh, Fast & Flavorful
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={() => setShowQR(!showQR)}
                className="hidden sm:flex bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                📱 QR Menu
              </button>
              <a
                href="/cart"
                className="relative bg-rose-500 p-3 sm:p-4 rounded-xl hover:bg-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FiShoppingCart className="text-2xl text-white" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">
                    {cartItemCount}
                  </span>
                )}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Scan to Order
              </h2>
              <button
                onClick={() => setShowQR(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="text-2xl" />
              </button>
            </div>
            <div className="flex justify-center mb-6 bg-white p-6 rounded-2xl border-4 border-rose-100">
              <QRCode
                value={window.location.href}
                size={220}
                level="H"
                fgColor="#f43f5e"
              />
            </div>
            <p className="text-center text-gray-600 text-sm mb-6">
              Scan this QR code with your phone camera to view our digital menu
            </p>
            <button
              onClick={() => setShowQR(false)}
              className="w-full btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search Bar */}
        <div className="mb-8 sm:mb-12">
          <div className="relative max-w-2xl mx-auto">
            <FiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search for delicious dishes..."
              className="w-full pl-14 pr-6 py-4 sm:py-5 rounded-2xl border-2 border-gray-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none text-lg shadow-lg transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 overflow-x-auto pb-6 mb-8 sm:mb-12 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold whitespace-nowrap transition-all duration-300 shadow-md ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-lg scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="bg-gray-200 h-56 rounded-xl mb-4"></div>
                <div className="bg-gray-200 h-6 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="bg-gray-200 h-8 w-20 rounded"></div>
                  <div className="bg-gray-200 h-10 w-24 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-56 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      {item.isVeg && (
                        <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          🌱 VEG
                        </span>
                      )}
                      {!item.isAvailable && (
                        <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <p className="text-xs font-semibold text-gray-700">
                        ⏱️ {item.prepTime} mins
                      </p>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex justify-between items-center mt-auto">
                      <div>
                        <p className="text-3xl font-black bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={!item.isAvailable}
                        className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all duration-300 shadow-lg ${
                          item.isAvailable
                            ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:shadow-xl active:scale-95"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <FiPlus className="text-lg" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-20">
                <div className="text-8xl mb-6">🔍</div>
                <p className="text-gray-500 text-2xl font-semibold mb-4">
                  No items found
                </p>
                <p className="text-gray-400 mb-8">
                  Try searching with different keywords
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="btn-outline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Cart Button (Mobile) */}
      {cartItemCount > 0 && (
        <a
          href="/cart"
          className="fixed bottom-6 right-6 sm:hidden bg-gradient-to-r from-rose-500 to-orange-500 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 font-bold animate-bounce z-40"
        >
          <FiShoppingCart className="text-xl" />
          View Cart (${getCartTotal().toFixed(2)})
        </a>
      )}
    </div>
  );
};

export default Menu;
