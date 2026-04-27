require("dotenv").config({ path: "./.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ROUTES IMPORT
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");
const searchRoutes = require("./routes/search");
const adminRoutes = require("./routes/admin"); // ✅ ADDED

const app = express();
const PORT = process.env.PORT || 5000;

/* DEBUG */
console.log("ENV CHECK:", process.env.MONGO_URI);

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* SCHEMA */
const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
  },
  { timestamps: true }
);

// ✅ SAFE MODEL (overwrite error avoid)
const Contact =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);

/* ROUTES */
app.use("/api/products", productRoutes);
app.use("/api", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/admin", adminRoutes); // ✅ 🔥 FIXED

// TEST
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

/* DB CONNECT */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ DB Error:", err.message);
  });