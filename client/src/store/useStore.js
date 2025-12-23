import { create } from "zustand";

export const useStore = create((set, get) => ({
  // Cart State
  cart: [],
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.cart.find((i) => i._id === item._id);
      if (existingItem) {
        return {
          cart: state.cart.map((i) =>
            i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }),

  removeFromCart: (itemId) =>
    set((state) => ({
      cart: state.cart.filter((i) => i._id !== itemId),
    })),

  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      cart: state.cart.map((i) => (i._id === itemId ? { ...i, quantity } : i)),
    })),

  clearCart: () => set({ cart: [] }),

  getCartTotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  // User State
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, cart: [] }),

  // Orders State
  orders: [],
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

  // Menu State
  menuItems: [],
  setMenuItems: (items) => set({ menuItems: items }),
}));
