const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
      quantity: { type: Number, required: true }
    }
  ],
  totalPrice: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ["Processing order.", "Order Complete.", "Order Cancelled."], 
    default: "Processing order." 
  },
  completedAt: { type: Date }, //timer
  confirmedByStudent: { type: Boolean, default: false }
});

module.exports = mongoose.model("Order", OrderSchema);
