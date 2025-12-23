import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
  FiImage,
} from "react-icons/fi";
import { menuAPI } from "../../services/api";
import toast from "react-hot-toast";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Main Course",
    image: "",
    isVeg: true,
    isAvailable: true,
    prepTime: 15,
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await menuAPI.getAll();
      setMenuItems(response.data.data);
    } catch (error) {
      toast.error("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await menuAPI.update(editingItem._id, formData);
        toast.success("Menu item updated successfully!");
      } else {
        await menuAPI.create(formData);
        toast.success("Menu item added successfully!");
      }

      fetchMenu();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save menu item");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      prepTime: item.prepTime,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await menuAPI.delete(id);
        toast.success("Item deleted successfully!");
        fetchMenu();
      } catch (error) {
        toast.error("Failed to delete item");
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Main Course",
      image: "",
      isVeg: true,
      isAvailable: true,
      prepTime: 15,
    });
  };

  // Sample images for quick selection
  const sampleImages = [
    "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400",
    "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400",
    "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400",
    "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400",
    "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=400",
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-gray-800">
            Menu Management
          </h1>
          <p className="text-gray-600">Manage your restaurant menu items</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <FiPlus /> Add New Item
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex gap-4">
                <div className="bg-gray-200 w-24 h-24 rounded-xl"></div>
                <div className="flex-1 space-y-3">
                  <div className="bg-gray-200 h-6 rounded w-1/3"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-rose-50 to-orange-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">
                      Image
                    </th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">
                      Name
                    </th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">
                      Category
                    </th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">
                      Price
                    </th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">
                      Type
                    </th>
                    <th className="text-left py-4 px-6 font-bold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {menuItems.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-xl shadow-md"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-lg font-bold text-rose-500">
                          ${item.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.isVeg
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {item.isVeg ? "🌱 VEG" : "🍖 NON-VEG"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden grid gap-4">
            {menuItems.map((item) => (
              <div key={item._id} className="card">
                <div className="flex gap-4 mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl shadow-md flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-800 mb-1 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-xl font-bold text-rose-500">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {item.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.isVeg
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {item.isVeg ? "🌱 VEG" : "🍖 NON-VEG"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md font-semibold flex items-center justify-center gap-2"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-md font-semibold flex items-center justify-center gap-2"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {menuItems.length === 0 && (
            <div className="text-center py-20">
              <div className="text-8xl mb-6">🍽️</div>
              <p className="text-gray-500 text-2xl font-semibold mb-4">
                No menu items yet
              </p>
              <p className="text-gray-400 mb-8">
                Add your first menu item to get started
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary"
              >
                <FiPlus className="inline mr-2" /> Add Menu Item
              </button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Margherita Pizza"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    Category *
                  </label>
                  <select
                    required
                    className="input-field"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option>Appetizer</option>
                    <option>Main Course</option>
                    <option>Dessert</option>
                    <option>Beverage</option>
                    <option>Special</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Description *
                </label>
                <textarea
                  required
                  rows="3"
                  className="input-field"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your delicious dish..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    className="input-field"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-gray-700">
                    Prep Time (mins) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="input-field"
                    value={formData.prepTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prepTime: parseInt(e.target.value),
                      })
                    }
                    placeholder="15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  className="input-field mb-3"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />

                {/* Image Preview */}
                {formData.image && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl"
                      onError={(e) =>
                        (e.target.src =
                          "https://via.placeholder.com/400x300?text=Invalid+Image")
                      }
                    />
                  </div>
                )}

                {/* Sample Images */}
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Or select from samples:
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {sampleImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Sample ${idx + 1}`}
                        className="w-full h-16 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-rose-500 transition-all"
                        onClick={() => setFormData({ ...formData, image: img })}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 bg-gray-50 p-4 rounded-xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                    checked={formData.isVeg}
                    onChange={(e) =>
                      setFormData({ ...formData, isVeg: e.target.checked })
                    }
                  />
                  <span className="font-semibold text-gray-700">
                    🌱 Vegetarian
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-green-500 focus:ring-green-500"
                    checked={formData.isAvailable}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isAvailable: e.target.checked,
                      })
                    }
                  />
                  <span className="font-semibold text-gray-700">
                    ✅ Available
                  </span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <FiSave /> {editingItem ? "Update" : "Add"} Item
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 text-gray-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
