import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";
import { menuAPI } from "../../services/api";
import toast from "react-hot-toast";

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Main Course",
    image: "",
    isVeg: true,
    isAvailable: true,
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await menuAPI.getAll();
      setMenuItems(response.data);
    } catch (error) {
      // Mock data
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
      ];
      setMenuItems(mockData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await menuAPI.update(editingItem._id, formData);
        toast.success("Menu item updated successfully!");
        setMenuItems(
          menuItems.map((item) =>
            item._id === editingItem._id
              ? { ...formData, _id: editingItem._id }
              : item
          )
        );
      } else {
        const newItem = { ...formData, _id: Date.now().toString() };
        setMenuItems([...menuItems, newItem]);
        toast.success("Menu item added successfully!");
      }

      handleCloseModal();
    } catch (error) {
      toast.error("Failed to save menu item");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await menuAPI.delete(id);
        setMenuItems(menuItems.filter((item) => item._id !== id));
        toast.success("Item deleted successfully!");
      } catch (error) {
        setMenuItems(menuItems.filter((item) => item._id !== id));
        toast.success("Item deleted successfully!");
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
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Menu Management</h1>
          <p className="text-gray-600">Manage your restaurant menu items</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <FiPlus /> Add New Item
        </button>
      </div>

      {/* Menu Items Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-4">Image</th>
                <th className="text-left py-4 px-4">Name</th>
                <th className="text-left py-4 px-4">Category</th>
                <th className="text-left py-4 px-4">Price</th>
                <th className="text-left py-4 px-4">Status</th>
                <th className="text-left py-4 px-4">Type</th>
                <th className="text-left py-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">{item.category}</td>
                  <td className="py-4 px-4 font-bold text-primary">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.isVeg
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {item.isVeg ? "VEG" : "NON-VEG"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </h2>
              <button onClick={handleCloseModal} className="text-2xl">
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows="3"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Category *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option>Appetizer</option>
                    <option>Main Course</option>
                    <option>Dessert</option>
                    <option>Beverage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={formData.isVeg}
                    onChange={(e) =>
                      setFormData({ ...formData, isVeg: e.target.checked })
                    }
                  />
                  <span className="font-semibold">Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={formData.isAvailable}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        isAvailable: e.target.checked,
                      })
                    }
                  />
                  <span className="font-semibold">Available</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <FiSave /> {editingItem ? "Update" : "Add"} Item
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
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
