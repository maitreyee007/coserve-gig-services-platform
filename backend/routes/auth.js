const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getMe,
} = require("../Controllers/Authcontroller");

const { protect } = require("../Middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;