const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "plumbing",
        "electrical",
        "cleaning",
        "carpentry",
        "painting",
        "appliance",
        "gardening",
        "other",
      ],
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    emergencyAvailable: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);