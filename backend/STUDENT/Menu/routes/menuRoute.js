const express = require("express");
const Menu = require("../../Menu/models/menu"); // menu model import
const Cart = require("../../Cart/models/cart"); // cart model import
const authMiddleware = require("../../Users/middlewares/authMiddleware"); // middleware import

const router = express.Router();

// get on menu
router.get("/", async (req, res) => {
  try {
    const menu = await Menu.find();
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// add item to cart
router.post("/cart", authMiddleware, async (req, res) => {
  try {
    const { menuItemId, quantity } = req.body;
    const userId = req.user.id; 

    
    const menuItem = await Menu.findById(menuItemId);
    if (!menuItem) return res.status(404).json({ error: "Item not found" });

   
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

// get products from cart
router.get("/cart", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("items.menuItem"); 

    if (!cart) return res.json({ message: "Your cart is empty" });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete("/cart/:menuItemId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { menuItemId } = req.params;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(item => item.menuItem.toString() !== menuItemId);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
