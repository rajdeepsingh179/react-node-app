require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ================== SCHEMAS ================== */

/* PRODUCT */
const ProductSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  imageUrl: String,
  price: Number,
  stock: Number
});

const Product = mongoose.model("Product", ProductSchema);

/* CONTACT */
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
}, { timestamps: true });

const Contact = mongoose.model("Contact", contactSchema);

/* ================== ROUTES ================== */

/* HOME */
app.get("/", (req, res) => {
  res.send("Fabornas Backend Running 🚀");
});

/* ADD PRODUCT */
app.post("/add-product", async (req, res) => {
  try {
    const { name, category, description, imageUrl, price, stock } = req.body;

    const product = new Product({
      name,
      category,
      description,
      imageUrl,
      price,
      stock
    });

    await product.save();
    res.send("Product Added");
  } catch (error) {
    console.log("Add Product Error:", error);
    res.status(500).send("Error adding product");
  }
});

/* GET PRODUCTS */
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

/* 🔥 TEST ROUTE (IMPORTANT FOR DEBUG) */
app.get("/api/contact", (req, res) => {
  res.send("GET working");
});

/* CONTACT API (POST) */
app.post("/api/contact", async (req, res) => {
  try {
    console.log("BODY:", req.body); // debug

    const newMsg = new Contact(req.body);
    await newMsg.save();

    console.log("Saved Successfully");

    res.json({ success: true });

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ error: "Error saving message" });
  }
});

/* ================== DB CONNECT ================== */

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log("MongoDB Atlas Connected");

    app.listen(PORT, () =>
      console.log("Server running on port " + PORT)
    );
  })
  .catch(err => {
    console.log("MongoDB Error:", err);
  });