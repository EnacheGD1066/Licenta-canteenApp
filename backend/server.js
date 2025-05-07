require("dotenv").config(); 

const express = require("express");  // express.js
const mongoose = require("mongoose");   // MongoDB
const cors = require("cors");  // API middlewares
const rateLimit = require("express-rate-limit"); // brute force attack prevention

// Variabilele de mediu
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Debugging Mongo credentials if needed
console.log("MONGO_URI:", MONGO_URI);

// Limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,  
  keyGenerator: (req) => req.body.email || req.ip, 
  message: { error: "Too many login attempts. Please try again later." }
});

// Import routes
const authenticateRoute = require("./STUDENT/Users/routes/authenticateRoute");  
const menuRoute = require("./STUDENT/Menu/routes/menuRoute");  
const orderRoute = require("./STUDENT/Orders/routes/orderRoute");  
const cartRoute = require("./STUDENT/Cart/routes/cartRoute");  
const paymentRoute = require("./STUDENT/Payment/routes/paymentRoute");
const adminAuthRoute = require("./ADMIN/routes/adminAuthRoute");



const app = express();
app.use(cors());
app.use(express.json());

console.log("Ruta merge");
app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authenticateRoute);
app.use("/api/menu", menuRoute);
app.use("/api/orders", orderRoute);
app.use("/api/cart", cartRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/admin/auth", adminAuthRoute);

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("Mongo is connected"))
  .catch(err => console.log("ERROR:", err));

app.listen(PORT, () => console.log(`Server is running on... ${PORT}`));
