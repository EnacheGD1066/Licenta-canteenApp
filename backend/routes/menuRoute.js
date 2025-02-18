const express = require("express");
const router = express.Router();

// Test
router.get("/", (req, res) => {
  res.send("merge menu");
});

module.exports = router;
