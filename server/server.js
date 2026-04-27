const express = require("express");
const router = express.Router();

// DEBUG
router.get("/test", (req, res) => {
  res.json({ ok: true });
});

router.get("/", async (req, res) => {
  try {
    res.json({ msg: "search working" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;