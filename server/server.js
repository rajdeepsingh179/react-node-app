const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// 🔥 MongoDB Atlas
mongoose.connect("mongodb://fabornas1991:Fabornas%401991@ac-no0bfxf-shard-00-00.1qllum3.mongodb.net:27017,ac-no0bfxf-shard-00-01.1qllum3.mongodb.net:27017,ac-no0bfxf-shard-00-02.1qllum3.mongodb.net:27017/productsdb?tls=true&replicaSet=atlas-fs9zyz-shard-0&authSource=admin&retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Atlas Connected ✅"))
  .catch(err => console.log("DB Error ❌:", err));

// ROUTES
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact"); // 🔥 ADD THIS

app.use("/api/products", productRoutes);
app.use("/api", authRoutes);
app.use("/api/contact", contactRoutes); // 🔥 ADD THIS

// TEST
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000 🔥");
});