const express = require("express");
const Menu = require("../../Menu/models/menu"); // menu model import
const Cart = require("../../Cart/models/cart"); // cart model import
const Order = require("../../Orders/models/orders"); // order model import
const authMiddleware = require("../../Users/middlewares/authMiddleware"); // middleware import
const mongoose = require("mongoose"); // 

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

    // code logic for limiting the orders per student daily
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const userObjectId = mongoose.Types.ObjectId.createFromHexString(userId);

  
    const ordersToday = await Order.countDocuments({
      userId: userObjectId,
      orderDate: { $gte: startOfDay, $lte: endOfDay }
    });

    if (ordersToday >= 2) {
      return res.status(403).json({ error: "You have reached the limit of 2 orders per day." });
    }

    // verificare comenzi anterioare cu acelasi produs
    const ordersWithSameProduct = await Order.aggregate([
      {
        $match: {
          userId: userObjectId,
          orderDate: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      { $unwind: "$items" },
      {
        $match: {
          "items.menuItem": mongoose.Types.ObjectId.createFromHexString(menuItemId)
        }
      },
      {
        $group: {
          _id: null,
          totalOrdered: { $sum: "$items.quantity" }
        }
      }
    ]);

    const alreadyOrderedQty = ordersWithSameProduct[0]?.totalOrdered || 0;

    let cart = await Cart.findOne({ userId });

    const currentCartQty = cart?.items?.find(i => i.menuItem.toString() === menuItemId)?.quantity || 0;

    const totalAfterAdd = alreadyOrderedQty + currentCartQty + quantity;

    if (totalAfterAdd > 2) {
      return res.status(400).json({ error: "You cannot order more than 2 products of the same type in the same day!" });
    }

    // end of code logic for limiting no of orders per student

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
