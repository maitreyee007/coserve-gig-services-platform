const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Service = require("../Models/Service");
const { protect, authorize } = require("../Middleware/auth");

// Get all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });

    res.json({
      success: true,
      services,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get one service
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid service ID" });
    }
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.json({
      success: true,
      service,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create service - admin only
router.post(
  "/",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const service = await Service.create(req.body);

      res.status(201).json({
        success: true,
        message: "Service created successfully",
        service,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Update service
router.put(
  "/:id",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid service ID" });
      }
      const allowedFields = ["name", "description", "category", "basePrice", "emergencyAvailable", "image", "isActive"];
      const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
      const service = await Service.findByIdAndUpdate(
        req.params.id,
        updates,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!service) {
        return res.status(404).json({ success: false, message: "Service not found" });
      }
      res.json({
        success: true,
        message: "Service updated successfully",
        service,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Delete/deactivate service
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ success: false, message: "Invalid service ID" });
      }
      const service = await Service.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );

      if (!service) {
        return res.status(404).json({ success: false, message: "Service not found" });
      }
      res.json({
        success: true,
        message: "Service removed successfully",
        service,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;