const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();

        console.log("✅ Products from DB:", products); // 👈 YAHAN ADD KARNA HAI

        res.json(products);
    } catch (error) {

        console.log("❌ ERROR:", error); // 👈 YAHAN BHI ADD KAR

        res.status(500).json({ message: error.message });
    }
});

// CREATE product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
      category: req.body.category,
      stock: req.body.stock
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE product
router.patch('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (req.body.name) product.name = req.body.name;
        if (req.body.price) product.price = req.body.price;
        if (req.body.description) product.description = req.body.description;
        if (req.body.imageUrl) product.imageUrl = req.body.imageUrl;
        if (req.body.category) product.category = req.body.category;
        if (req.body.stock) product.stock = req.body.stock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await product.deleteOne();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;