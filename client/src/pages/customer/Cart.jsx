import React, { useState } from "react";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiArrowLeft,
  FiCreditCard,
} from "react-icons/fi";
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
    email: "",
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

    const subtotal = getCartTotal();
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const orderData = {
      customer: customerInfo,
      items: cart.map((item) => ({
        menuItem: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      tax,
      total,
      specialInstructions: customerInfo.specialInstructions,
    };

    try {
      const response = await orderAPI.create(orderData);
      toast.success("🎉 Order placed successfully!");
      clearCart();
      navigate("/order-confirmation", { state: { order: response.data.data } });
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b-2 border-rose-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <FiArrowLeft className="text-2xl" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Your Cart
              </h1>
              <p className="text-sm text-gray-600">{cart.length} items</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🛒</div>
            <p className="text-gray-500 text-2xl font-semibold mb-4">
              Your cart is empty
            </p>
            <p className="text-gray-400 mb-8">
              Add some delicious items to get started
            </p>
            <button onClick={() => navigate("/")} className="btn-primary">
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2 mb-2">
                      <h3 className="font-bold text-lg sm:text-xl text-gray-800 truncate">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <FiTrash2 className="text-xl" />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-2xl font-black text-rose-500">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                        <button
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                        >
                          <FiMinus className="text-rose-500" />
                        </button>
                        <span className="w-12 text-center font-bold text-lg">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                        >
                          <FiPlus className="text-rose-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
                <h2 className="text-xl font-bold mb-6 text-gray-800">
                  Customer Information
                </h2>
                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    className="input-field"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    className="input-field"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        phone: e.target.value,
                      })
                    }
                  />
                  <input
                    type="email"
                    placeholder="Email (Optional)"
                    className="input-field"
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        email: e.target.value,
                      })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Table Number (Optional)"
                    className="input-field"
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
                    className="input-field"
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

                <div className="border-t-2 border-gray-100 pt-6 mb-6">
                  <h3 className="font-bold text-lg mb-4 text-gray-800">
                    Order Summary
                  </h3>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (10%)</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t-2 border-gray-100 pt-3 flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-rose-500">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCreditCard /> Place Order
                    </>
                  )}
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
