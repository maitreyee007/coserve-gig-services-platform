const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const WorkerProfile = require("../Models/Workerprofile");
const { protect, authorize } = require("../Middleware/auth");

// Find workers
router.get("/", async (req, res) => {
  try {
    const { skill, location, maxRate, emergency } = req.query;

    const filter = {
      verificationStatus: "verified",
      availability: true,
    };

    if (skill) {
      filter.skills = {
        $regex: skill,
        $options: "i",
      };
    }

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    if (maxRate && (!Number.isFinite(Number(maxRate)) || Number(maxRate) < 0)) {
      return res.status(400).json({ success: false, message: "maxRate must be a non-negative number" });
    }

    if (maxRate) {
      filter.hourlyRate = {
        $lte: Number(maxRate),
      };
    }

    if (emergency === "true") {
      filter.emergencyAvailable = true;
    }

    const workers = await WorkerProfile.find(filter)
      .populate("user", "name email phone")
      .sort({ rating: -1, hourlyRate: 1 });

    res.json({
      success: true,
      count: workers.length,
      workers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get worker profile
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid worker ID" });
    }
    const worker = await WorkerProfile.findOne({ _id: req.params.id, verificationStatus: "verified" })
      .populate("user", "name email phone address");

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    res.json({
      success: true,
      worker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update own worker profile
router.put(
  "/profile/me",
  protect,
  authorize("worker"),
  async (req, res) => {
    try {
      const allowedFields = ["skills", "experience", "hourlyRate", "availability", "emergencyAvailable", "location"];
      const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
      const worker = await WorkerProfile.findOneAndUpdate(
        { user: req.user.id },
        updates,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!worker) {
        return res.status(404).json({ success: false, message: "Worker profile not found" });
      }
      res.json({
        success: true,
        message: "Worker profile updated",
        worker,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;