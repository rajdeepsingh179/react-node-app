const express = require("express");
const router = express.Router();

// TEMP DATA
router.get("/", (req, res) => {
  res.json([
    {
      name: "Raj",
      email: "raj@gmail.com",
      message: "Hello from user"
    }
  ]);
});

module.exports = router;