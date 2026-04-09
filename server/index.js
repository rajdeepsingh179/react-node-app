require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Correct Atlas connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch(err => console.log(err));

// Schema
const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  desc: String,
  img: String,
  price: Number
});

const Product = mongoose.model("Product", ProductSchema);

// Add product
app.post("/add-product", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.send("Product Added");
});

// Get products
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.listen(5000, () => console.log("Server running on port 5000"));