const express = require("express");  // express.js
const mongoose = require("mongoose");   // mongo db
const cors = require("cors");  // API middlewares
require("dotenv").config(); // env eport 

const authenticateRoute = require("../routes/authenticateRoute");  // routes for authenticating
const menuRoute = require("../routes/menuRoute");  // routes for menu
const orderRoute = require("../routes/orderRoute");  //routes for orders


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authenticateRoute);
app.use("/api/menu", menuRoute);
app.use("/api/orders", orderRoute);



// Mongo db connect
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Mongo is connected..."))
  .catch(err => console.log("ERROR", err));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on... ${PORT}`));
