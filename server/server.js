require("dotenv").config({ path: "./.env" });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// ROUTES IMPORT
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");
const searchRoutes = require("./routes/searchroutes");
const adminRoutes = require("./routes/admin");
const contactRoutes = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 5000;

console.log("ENV CHECK:", process.env.MONGO_URI ? "✅ MONGO_URI found" : "❌ MONGO_URI missing");

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// SCHEMA
const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
  },
  { timestamps: true }
);

// SAFE MODEL
const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

// ROUTES
app.use("/api/products", productRoutes);
app.use("/api", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/admin", adminRoutes);

// HOME TEST
app.get("/", (req, res) => {
  res.send("Fabornas Backend Running 🚀");
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

// ERROR HANDLING
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// DB CONNECT & START SERVER
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });