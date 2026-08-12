const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

// SEARCH
router.get("/", async (req, res) => {
  try {
    const q = req.query.q || "";

    const products = await Product.find({
      name: { $regex: q, $options: "i" }
    }).limit(6);

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TEST
router.get("/test", (req, res) => {
  res.json({ ok: true });
});

module.exports = router;