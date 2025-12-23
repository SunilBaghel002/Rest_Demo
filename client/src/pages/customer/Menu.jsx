import React, { useState, useEffect } from "react";
import { FiShoppingCart, FiSearch, FiPlus } from "react-icons/fi";
import { useStore } from "../../store/useStore";
import { menuAPI } from "../../services/api";
import toast from "react-hot-toast";
import QRCode from "qrcode.react";

export default function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showQR, setShowQR] = useState(false);

  const { cart, addToCart } = useStore();

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await menuAPI.getAll();
      setMenuItems(response.data);
      setFilteredItems(response.data);
    } catch (error) {
      // Use mock data for demo
      const mockData = [
        {
          _id: "1",
          name: "Margherita Pizza",
          description: "Fresh tomatoes, mozzarella, basil",
          price: 12.99,
          category: "Main Course",
          image:
            "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400",
          isVeg: true,
          isAvailable: true,
        },
        {
          _id: "2",
          name: "Caesar Salad",
          description: "Romaine lettuce, parmesan, croutons",
          price: 8.99,
          category: "Appetizer",
          image:
            "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
          isVeg: true,
          isAvailable: true,
        },
        {
          _id: "3",
          name: "Grilled Chicken",
          description: "Tender chicken with herbs",
          price: 15.99,
          category: "Main Course",
          image:
            "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400",
          isVeg: false,
          isAvailable: true,
        },
        {
          _id: "4",
          name: "Chocolate Lava Cake",
          description: "Warm chocolate cake with vanilla ice cream",
          price: 6.99,
          category: "Dessert",
          image:
            "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400",
          isVeg: true,
          isAvailable: true,
        },
        {
          _id: "5",
          name: "Pasta Carbonara",
          description: "Creamy pasta with bacon and parmesan",
          price: 13.99,
          category: "Main Course",
          image:
            "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",
          isVeg: false,
          isAvailable: true,
        },
        {
          _id: "6",
          name: "Fresh Lemonade",
          description: "House-made fresh lemonade",
          price: 3.99,
          category: "Beverage",
          image:
            "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=400",
          isVeg: true,
          isAvailable: true,
        },
      ];
      setMenuItems(mockData);
      setFilteredItems(mockData);
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
    toast.success(`${item.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                🍽️ Delicious Bites
              </h1>
              <p className="text-gray-600 text-sm">Scan, Order, Enjoy!</p>
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => setShowQR(!showQR)}
                className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
              >
                Show QR
              </button>
              <a href="/cart" className="relative">
                <FiShoppingCart className="text-3xl text-dark" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {cart.length}
                  </span>
                )}
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Scan to View Menu
            </h2>
            <div className="flex justify-center mb-4">
              <QRCode value={window.location.href} size={256} />
            </div>
            <button
              onClick={() => setShowQR(false)}
              className="w-full btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search for dishes..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item._id} className="card hover:shadow-xl transition-all">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                {item.isVeg && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    VEG
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-4 text-sm">{item.description}</p>

              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">
                  ${item.price.toFixed(2)}
                </span>
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.isAvailable}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                    item.isAvailable
                      ? "bg-primary text-white hover:bg-red-600"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FiPlus /> Add
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No items found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// export default Menu;
