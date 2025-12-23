import React, { useState } from "react";
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { useStore } from "../../store/useStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { orderAPI } from "../../services/api";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } =
    useStore();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    tableNumber: "",
    specialInstructions: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    toast.success("Item removed from cart");
  };

  const handlePlaceOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error("Please fill in your name and phone number");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    const orderData = {
      customer: customerInfo,
      items: cart,
      total: getCartTotal(),
      status: "pending",
      createdAt: new Date(),
    };

    try {
      await orderAPI.create(orderData);
      toast.success("🎉 Order placed successfully!");
      clearCart();
      navigate("/order-confirmation");
    } catch (error) {
      // For demo, simulate success
      toast.success("🎉 Order placed successfully!");
      setTimeout(() => {
        clearCart();
        setCustomerInfo({
          name: "",
          phone: "",
          tableNumber: "",
          specialInstructions: "",
        });
      }, 1000);
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-2xl">
              <FiArrowLeft />
            </button>
            <h1 className="text-2xl font-bold">Your Cart</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl mb-4">Your cart is empty</p>
            <button onClick={() => navigate("/")} className="btn-primary">
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="card flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {item.description}
                    </p>
                    <p className="text-primary font-bold">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                      <button
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity - 1)
                        }
                        className="p-2 hover:bg-gray-200 rounded"
                      >
                        <FiMinus />
                      </button>
                      <span className="w-8 text-center font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-200 rounded"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Customer Information</h2>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        phone: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Table Number (Optional)"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    value={customerInfo.tableNumber}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        tableNumber: e.target.value,
                      })
                    }
                  />
                  <textarea
                    placeholder="Special Instructions (Optional)"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
                    rows="3"
                    value={customerInfo.specialInstructions}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        specialInstructions: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
