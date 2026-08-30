const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Review = require("../Models/Review");
const Booking = require("../Models/Booking");
const WorkerProfile = require("../Models/Workerprofile");

const { protect, authorize } = require("../Middleware/auth");

// Add review
router.post("/", protect, authorize("user"), async (req, res) => {
  try {
    const { booking, rating, comment, complaint } = req.body;

    if (!mongoose.isValidObjectId(booking) || !Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ success: false, message: "Valid booking ID and rating from 1 to 5 are required" });
    }

    const existingReview = await Review.findOne({ booking });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Review already submitted",
      });
    }

    const bookingData = await Booking.findOne({
      _id: booking,
      customer: req.user.id,
      status: "completed",
    });

    if (!bookingData) {
      return res.status(400).json({
        success: false,
        message: "You can review only completed bookings",
      });
    }

    const review = await Review.create({
      booking,
      customer: req.user.id,
      worker: bookingData.worker,
      rating: Number(rating),
      comment,
      complaint: Boolean(complaint),
    });

    // Update worker rating
    const reviews = await Review.find({
      worker: bookingData.worker,
    });

    const totalRating = reviews.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    const averageRating = totalRating / reviews.length;

    const workerUpdate = {
      $set: {
        rating: Number(averageRating.toFixed(2)),
        totalReviews: reviews.length,
      },
    };
    if (complaint) {
      workerUpdate.$inc = { complaints: 1, rateAdjustment: -10 };
    }
    await WorkerProfile.findOneAndUpdate({ user: bookingData.worker }, workerUpdate);

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Get reviews for worker
router.get("/worker/:workerId", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.workerId)) {
      return res.status(400).json({ success: false, message: "Invalid worker ID" });
    }
    const reviews = await Review.find({
      worker: req.params.workerId,
    }).populate("customer", "name");

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;