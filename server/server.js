require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// 🔥 MongoDB Atlas
// 🔥 MongoDB Atlas (from .env)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected ✅"))
  .catch(err => console.log("DB Error ❌:", err));

// ROUTES
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const orderRoutes = require("./routes/orders"); // 🔥 ADD HERE

app.use("/api/products", productRoutes);
app.use("/api", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes); // 🔥 ADD HERE

// TEST
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// START SERVER (ALWAYS LAST)
app.listen(5000, () => {
  console.log("Server running on port 5000 🔥");
});