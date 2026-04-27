const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const verifyAdmin = require("../middleware/admin");
const Product = require("../models/Product"); // ✅ ONLY IMPORT

// STORAGE
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 🔐 ADD PRODUCT (ADMIN ONLY)
router.post("/", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : ""
    });

    await product.save();
    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error adding product" });
  }
});

// 📦 GET PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Fetch error" });
  }
});

// 🔐 DELETE PRODUCT
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;