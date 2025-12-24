const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// 1. GET ALL: Mengambil semua history pesanan
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 }); // Sort by newest first
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST: Menambahkan pesanan baru
router.post("/", async (req, res) => {
  const order = new Order({
    customerName: req.body.customerName,
    items: req.body.items,
    total: req.body.total,
    paymentMethod: req.body.paymentMethod,
    status: req.body.status,
    date: req.body.date || Date.now(),
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. DELETE: Menghapus pesanan
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order tidak ditemukan" });
    }
    res.status(200).json({ message: "Order berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
