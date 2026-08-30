const mongoose = require("mongoose");

const workerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    skills: [
      {
        type: String,
      },
    ],

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    hourlyRate: {
      type: Number,
      required: true,
      min: 0,
    },

    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    completedJobs: {
      type: Number,
      default: 0,
    },

    availability: {
      type: Boolean,
      default: true,
    },

    emergencyAvailable: {
      type: Boolean,
      default: false,
    },

    location: {
      type: String,
      default: "",
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    complaints: {
      type: Number,
      default: 0,
    },

    rateAdjustment: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WorkerProfile", workerProfileSchema);