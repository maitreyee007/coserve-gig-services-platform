const User = require("../Models/User");
const mongoose = require("mongoose");
const Booking = require("../Models/Booking");
const Service = require("../Models/Service");
const WorkerProfile = require("../Models/Workerprofile");

exports.getDashboard = async (req, res) => {
  try {
    const users = await User.countDocuments({ role: "user" });
    const workers = await User.countDocuments({ role: "worker" });
    const bookings = await Booking.countDocuments();
    const services = await Service.countDocuments({ isActive: true });

    res.json({
      success: true,
      dashboard: {
        users,
        workers,
        bookings,
        services,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getWorkers = async (req, res) => {
  try {
    const workers = await WorkerProfile.find()
      .populate("user", "name email phone")
      .sort({ rating: -1 });

    res.json({
      success: true,
      workers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.verifyWorker = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid worker ID" });
    }
    const worker = await WorkerProfile.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus: "verified",
      },
      {
        new: true,
      }
    );

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found",
      });
    }

    res.json({
      success: true,
      message: "Worker verified successfully",
      worker,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.disableUser = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      {
        new: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "User disabled successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = exports;