const express = require("express");
const router = express.Router();

const {
  getDashboard,
  getUsers,
  getWorkers,
  verifyWorker,
  disableUser,
} = require("../Controllers/Admincontroller");

const { protect, authorize } = require("../Middleware/auth");

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.get("/workers", getWorkers);
router.put("/workers/:id/verify", verifyWorker);
router.put("/users/:id/disable", disableUser);

module.exports = router;