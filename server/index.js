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
  const product = new Product(req.body);
  await product.save();
  res.send("Product Added");
});

app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

/* 🔥 IMPORTANT: PORT FIX */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on port " + PORT));