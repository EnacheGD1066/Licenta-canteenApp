const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  price: { type: Number, required: true }, 
  description: { type: String }, 
  available: { type: Boolean, default: true },
  stock: { type: Number, default: 500 }
});

module.exports = mongoose.model("Menu", MenuSchema);
