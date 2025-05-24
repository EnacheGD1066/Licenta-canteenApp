const express = require("express");
const router = express.Router();
const authMiddleware = require("../../Users/middlewares/authMiddleware");
const Cart = require("../../Cart/models/cart");
const Order = require("../../Orders/models/orders");
const Payment = require("../../Payment/models/payments");
const Menu = require("../../Menu/models/menu");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, cardNumber, expiry, cvv } = req.body;

    if (!name || !cardNumber || !expiry || !cvv) {
      return res.status(400).json({ error: "All fields are mandatory!" });
    }

    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("items.menuItem");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty!" });
    }

    const totalPrice = cart.items.reduce((sum, item) => {
      return sum + item.menuItem.price * item.quantity;
    }, 0);

    const order = new Order({
      userId,
      items: cart.items.map(item => ({
        menuItem: item.menuItem._id,
        quantity: item.quantity,
      })),
      totalPrice,
      status: "Processing order.",
    });

    await order.save();

    for (const item of cart.items) {
      const product = await Menu.findById(item.menuItem._id);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    await Cart.findOneAndDelete({ userId });

    await Payment.create({
      userId,
      name,
      cardNumber,
      expiry,
      cvv,
    });

    res.json({ message: "Payment finished successfully!", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
