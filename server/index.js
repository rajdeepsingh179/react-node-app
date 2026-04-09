require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* 🔥 ADD THIS HERE (MongoDB connection) */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch(err => {
    console.log("MongoDB Error:", err);
  });

/* ✅ Test route */
app.get("/", (req, res) => {
  res.send("Fabornas Backend Running 🚀");
});

/* ✅ Product schema */
const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  desc: String,
  img: String,
  price: Number
});

const Product = mongoose.model("Product", ProductSchema);

/* ✅ Routes */
app.post("/add-product", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.send("Product Added");
  } catch (error) {
    console.log("Add Product Error:", error);
    res.status(500).send("Error adding product");
  }
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.log("Products Error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/* 🔥 IMPORTANT: PORT FIX */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on port " + PORT));