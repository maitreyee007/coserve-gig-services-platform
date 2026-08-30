const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const router = express.Router();

const Booking = require("../Models/Booking");
const WorkerProfile = require("../Models/Workerprofile");
const Service = require("../Models/Service");

const { protect, authorize } = require("../Middleware/auth");

// Create booking
router.post("/", protect, authorize("user"), async (req, res) => {
  try {
    const {
      worker,
      service,
      bookingDate,
      address,
      description,
      amount,
      isEmergency,
    } = req.body;

    if (!mongoose.isValidObjectId(worker) || !mongoose.isValidObjectId(service)) {
      return res.status(400).json({ success: false, message: "Invalid worker or service ID" });
    }
    if (!bookingDate || Number.isNaN(new Date(bookingDate).getTime()) || !address?.trim()) {
      return res.status(400).json({ success: false, message: "Valid booking date and address are required" });
    }
    if (!Number.isFinite(Number(amount)) || Number(amount) < 0) {
      return res.status(400).json({ success: false, message: "Amount must be a non-negative number" });
    }

    const workerProfile = await WorkerProfile.findOne({
      user: worker,
      verificationStatus: "verified",
    });

    if (!workerProfile) {
      return res.status(404).json({
        success: false,
        message: "Verified worker not found",
      });
    }

    if (!workerProfile.availability) {
      return res.status(400).json({
        success: false,
        message: "Worker is currently unavailable",
      });
    }

    const serviceData = await Service.findOne({ _id: service, isActive: true });
    if (!serviceData) {
      return res.status(404).json({ success: false, message: "Active service not found" });
    }
    if (isEmergency && !serviceData.emergencyAvailable) {
      return res.status(400).json({ success: false, message: "Emergency booking is unavailable for this service" });
    }

    const emergencyCharge = isEmergency ? 100 : 0;

    const booking = await Booking.create({
      customer: req.user.id,
      worker,
      service,
      bookingDate,
      address,
      description,
      amount: Number(amount) + emergencyCharge,
      isEmergency: Boolean(isEmergency),
      emergencyCharge,
      otp: crypto.randomInt(100000, 1000000).toString(),
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Customer's bookings
router.get("/my", protect, async (req, res) => {
  try {
    const filter =
      req.user.role === "worker"
        ? { worker: req.user.id }
        : { customer: req.user.id };

    const bookings = await Booking.find(filter)
      .populate("customer", "name phone")
      .populate("worker", "name phone")
      .populate("service", "name category");

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Accept booking
router.put(
  "/:id/accept",
  protect,
  authorize("worker"),
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid booking ID" });
      }
      const booking = await Booking.findOneAndUpdate(
        {
          _id: req.params.id,
          worker: req.user.id,
          status: "pending",
        },
        {
          status: "accepted",
        },
        {
          new: true,
        }
      );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found or cannot be accepted",
        });
      }

      res.json({
        success: true,
        message: "Booking accepted",
        booking,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Start booking
router.put(
  "/:id/start",
  protect,
  authorize("worker"),
  async (req, res) => {
    try {
      const { otp } = req.body;

      if (!mongoose.isValidObjectId(req.params.id) || !/^\d{6}$/.test(String(otp || ""))) {
        return res.status(400).json({ success: false, message: "A valid booking ID and six-digit OTP are required" });
      }

      const booking = await Booking.findOne({
        _id: req.params.id,
        worker: req.user.id,
        status: "accepted",
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      if (booking.otp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }

      booking.status = "in-progress";
      booking.otpVerified = true;

      await booking.save();

      res.json({
        success: true,
        message: "Booking started",
        booking,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Complete booking
router.put(
  "/:id/complete",
  protect,
  authorize("worker"),
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid booking ID" });
      }
      const booking = await Booking.findOneAndUpdate(
        {
          _id: req.params.id,
          worker: req.user.id,
          status: "in-progress",
        },
        {
          status: "completed",
        },
        {
          new: true,
        }
      );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking cannot be completed",
        });
      }

      await WorkerProfile.findOneAndUpdate(
        { user: req.user.id },
        {
          $inc: { completedJobs: 1 },
        }
      );

      res.json({
        success: true,
        message: "Booking completed",
        booking,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Cancel booking
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid booking ID" });
    }
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      booking.customer.toString() !== req.user.id &&
      booking.worker.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (["completed", "cancelled"].includes(booking.status)) {
      return res.status(400).json({ success: false, message: "Booking can no longer be cancelled" });
    }

    booking.status = "cancelled";
    booking.cancellationReason = req.body.reason || "";

    await booking.save();

    res.json({
      success: true,
      message: "Booking cancelled",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;