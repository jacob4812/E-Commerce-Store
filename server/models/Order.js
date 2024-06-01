const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
    items: Array,
    sessionId: String,
    createdAt: { type: Date, default: Date.now },
  });
  
  const Order = mongoose.model("Order", orderSchema);

  module.exports = Order;