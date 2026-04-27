const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");

router.get("/stats", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // 🔥 SIMPLE & RELIABLE METHOD (no aggregation bug)
    const orders = await Order.find();

    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.total || 0);
    }, 0);

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;