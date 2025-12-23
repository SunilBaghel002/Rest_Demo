const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["Appetizer", "Main Course", "Dessert", "Beverage", "Special"],
    },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    prepTime: {
      type: Number,
      default: 15, // minutes
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
