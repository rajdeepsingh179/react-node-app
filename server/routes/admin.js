const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");


// 📊 ADMIN STATS (existing - untouched logic)
router.get("/stats", async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // ✅ existing working logic (DO NOT CHANGE)
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


// 📈 REVENUE CHART API (existing)
router.get("/revenue-chart", async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          },
          total: { $sum: "$total" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// 🔥 ANALYTICS (NEW – no conflict)
router.get("/analytics", async (req, res) => {
  try {
    const orders = await Order.find();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;

    // 📅 DAILY REVENUE
    const revenueMap = {};

    orders.forEach(order => {
      const date = order.createdAt.toISOString().slice(0, 10);

      if (!revenueMap[date]) revenueMap[date] = 0;
      revenueMap[date] += order.total;
    });

    const revenueData = Object.keys(revenueMap)
      .sort()
      .map(date => ({
        date,
        revenue: revenueMap[date]
      }));

    res.json({
      totalRevenue,
      totalOrders,
      revenueData
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// 🔥 FUTURE READY (existing)
router.get("/recent-orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(5);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;