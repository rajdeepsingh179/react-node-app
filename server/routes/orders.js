const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const verifyAdmin = require("../middleware/admin");

// ✅ PLACE ORDER (USER)
router.post("/", async (req, res) => {
  try {
    const { items, total, customerName, address } = req.body;

    const order = new Order({
      items,
      total,
      customerName,
      address
    });

    await order.save();

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Order failed ❌" });
  }
});

// ✅ GET ORDERS (ADMIN)
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Fetch error ❌" });
  }
});

// ✅ UPDATE STATUS
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: "Update failed ❌" });
  }
});

module.exports = router;