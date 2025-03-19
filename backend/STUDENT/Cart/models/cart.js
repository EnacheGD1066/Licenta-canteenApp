const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ]
});

module.exports = mongoose.model("Cart", CartSchema);
