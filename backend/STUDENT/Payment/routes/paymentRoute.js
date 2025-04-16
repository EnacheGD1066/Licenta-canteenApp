const express = require("express");
const router = express.Router();
const authMiddleware = require("../../Users/middlewares/authMiddleware");
const Cart = require("../../Cart/models/cart");
const Order = require("../../Orders/models/orders");
const Payment = require("../../Payment/models/payments");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, cardNumber, expiry, cvv } = req.body;

    if (!name || !cardNumber || !expiry || !cvv) {
      return res.status(400).json({ error: "Toate câmpurile sunt obligatorii." });
    }

    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("items.menuItem");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Coșul este gol." });
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
      status: "în procesare",
    });

    await order.save();
    await Cart.findOneAndDelete({ userId });

    await Payment.create({
      userId,
      name,
      cardNumber,
      expiry,
      cvv,
    });

    res.json({ message: "Plată efectuată cu succes!", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
