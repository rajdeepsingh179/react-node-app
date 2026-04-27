const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  imageUrl: String,
  category: String,
  stock: Number
});

// ✅ ONLY THIS EXPORT (IMPORTANT)
module.exports =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);