const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  items: Array, // cart items
  total: Number,
  customerName: String,
  address: String,
  status: {
    type: String,
    default: "Pending"
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);