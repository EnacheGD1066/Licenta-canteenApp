const MONGO_PASSWORD = process.env.MONGO_PASSWORD; // Password is saved on my local system
const MONGO_URI = `mongodb+srv://enachegeanina20:${MONGO_PASSWORD}@canteenapp.suzsu.mongodb.net/canteen_app?retryWrites=true&w=majority`;

// Debugging Mongo credentials if needed 
// console.log("MONGO_PASSWORD:", process.env.MONGO_PASSWORD); 
// console.log("MONGO_URI:", MONGO_URI); 

const express = require("express");  // express.js
const mongoose = require("mongoose");   // MongoDB
const cors = require("cors");  // API middlewares

const rateLimit = require("express-rate-limit"); // brute force attack prevention


// limiter for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,  
  keyGenerator: (req) => req.body.email || req.ip, 
  message: { error: "Too many login attempts. Please try again later." }
});


// Import routes
const authenticateRoute = require("./routes/authenticateRoute");  // Routes for authenticating
const menuRoute = require("./routes/menuRoute");  // Routes for menu
const orderRoute = require("./routes/orderRoute");  // Routes for orders

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/auth/login", loginLimiter);
app.use("/api/auth", authenticateRoute);
app.use("/api/menu", menuRoute);
app.use("/api/orders", orderRoute);

// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Mongo is connected"))
  .catch(err => console.log("ERROR:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on... ${PORT}`));
