const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// 🔥 MIDDLEWARES
const verifyAdmin = require("../middleware/admin");
const jwt = require("jsonwebtoken");

// 🔥 VERIFY TOKEN (INLINE — alag file ki zarurat nahi)
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token ❌" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, "secretkey"); // 🔥 SAME SECRET
    req.user = decoded;
    next();
  } catch (err) {
    console.log("TOKEN ERROR:", err);
    return res.status(401).json({ message: "Invalid token ❌" });
  }
};

// ✅ PLACE ORDER (USER)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, total, customerName, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items ❌" });
    }

    const order = new Order({
      items,
      total,
      customerName,
      address,
      status: "Pending",
      createdAt: new Date()
    });

    await order.save();

    res.json({ success: true, order });

  } catch (err) {
    console.log("ORDER ERROR:", err);
    res.status(500).json({ message: "Order failed ❌" });
  }
});

// ✅ GET ORDERS (ADMIN)
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });

  } catch (err) {
    console.log("FETCH ERROR:", err);
    res.status(500).json({ message: "Fetch error ❌" });
  }
});

// ✅ UPDATE STATUS (ADMIN)
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status
    });

    res.json({ success: true });

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed ❌" });
  }
});

module.exports = router;