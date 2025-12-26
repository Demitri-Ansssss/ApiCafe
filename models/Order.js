const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    items: [
      {
        id: String,
        nama: String,
        harga: Number,
        qty: Number,
        gambar: String,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "qris"],
      required: true,
    },
    status: {
      type: String,
      default: "success",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "orders",
  }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
