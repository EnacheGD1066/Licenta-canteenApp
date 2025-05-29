require("dotenv").config(); 

const express = require("express");  // express.js
const mongoose = require("mongoose");   // MongoDB
const cors = require("cors");  // API middlewares
const rateLimit = require("express-rate-limit"); // brute force attack prevention
const cron = require("node-cron");

// .env vars
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
// const adminOrdersRoute = require("./ADMIN/routes/adminOrderRoute");
// const adminMenuRoute = require("./ADMIN/routes/adminMenuRoute");
const employeeAuthRoute = require("./EMPLOYEE/routes/employeeAuthRoute");
const employeeOPRoute = require("./EMPLOYEE/routes/employeeOPRoute");
const Order = require("./STUDENT/Orders/models/orders");
const Menu = require("./STUDENT/Menu/models/menu");
const employeeCRUDMenuRoute = require("./EMPLOYEE/routes/employeeCRUDMenuRoute");


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
// app.use("/api/admin/orders", adminOrdersRoute);
// app.use("/api/admin/menu", adminMenuRoute);
app.use("/api/employee/auth", employeeAuthRoute);
app.use("/api/employee/orders", employeeOPRoute);
app.use("/api/employee/menu", employeeCRUDMenuRoute);

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("Mongo is connected"))
  .catch(err => console.log("ERROR:", err));

app.listen(PORT, () => console.log(`Server is running on... ${PORT}`));



cron.schedule("* * * * *", async () => {
  try {
    await Order.updateMany(
      {
        status: "Order Complete.",
        confirmedByStudent: false,
        completedAt: { $lte: new Date(Date.now() - 60 * 60 * 1000) }
      },
      { status: "Order Cancelled." }
    );
  } catch (err) {
    console.error("Cron error:", err);
  }
});


cron.schedule("0 0 * * *", async () => {
  try {
    await Menu.updateMany({}, { stock: 500 });
    console.log("Stocks have been reset to 500.");
  } catch (err) {
    console.error("Error resetting stocks!:", err);
  }
 // console.log("Current server time:", new Date().toString());
});
