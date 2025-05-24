const express = require("express");
const Cart = require("../models/cart");
const Menu = require("../../Menu/models/menu");
const Order = require("../../Orders/models/orders");
const authMiddleware = require("../../Users/middlewares/authMiddleware");

const router = express.Router();

// get cart products 
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.menuItem");

    if (!cart || cart.items.length === 0) {
      return res.json({ message: "Your cart is empty" });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// add product
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;
    const userId = req.user.id;

    const menuItem = await Menu.findById(menuItemId);
    if (!menuItem) return res.status(404).json({ error: "Product does not exist!" });  

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ menuItem: menuItemId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.menuItem.toString() === menuItemId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ menuItem: menuItemId, quantity });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// delete an item from the cart
router.delete("/:menuItemId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { menuItemId } = req.params;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart does not exist!" });

    cart.items = cart.items.filter(item => item.menuItem.toString() !== menuItemId);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// clear cart 
router.delete("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    await Cart.findOneAndDelete({ userId });
    res.json({ message: "Cart has been emptied" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//checkout 

router.post("/checkout", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("items.menuItem");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.menuItem.price * item.quantity;
    }, 0);

    const order = new Order({
      userId,
      items: cart.items.map(item => ({
        menuItem: item.menuItem._id,
        quantity: item.quantity
      })),
      totalPrice,
      status: "Processing order."
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

    res.json({ message: "Order was placed successfully!", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
