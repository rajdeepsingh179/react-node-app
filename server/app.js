require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 5000;

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

// 🔥 IMPORTANT (ADD THIS)
app.use("/uploads", express.static("uploads"));

/* SCHEMA */
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
}, { timestamps: true });

const Contact = mongoose.model("Contact", contactSchema);

/* ROUTES */

// 🔥 PRODUCTS ROUTE
app.use("/api/products", productRoutes);

// test
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// CONTACT POST
app.post("/api/contact", async (req, res) => {
  try {
    const newMsg = new Contact(req.body);
    await newMsg.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error saving message" });
  }
});

// CONTACT GET
app.get("/api/contact", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

/* CONNECT DB */
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log("✅ MongoDB connected");

  app.listen(PORT, () => {
    console.log("🚀 Server running on http://localhost:" + PORT);
  });
})
.catch(err => {
  console.log("DB Error:", err);
});