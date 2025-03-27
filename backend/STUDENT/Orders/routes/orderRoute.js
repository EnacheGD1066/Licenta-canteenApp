const express = require("express");
const router = express.Router();
const authMiddleware = require("../../Users/middlewares/authMiddleware");
const Order = require("../models/orders");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.menuItem")
      .sort({ orderDate: -1 }); 

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
