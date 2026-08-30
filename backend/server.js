const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { initializeDatabase } = require('./db');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.disable("x-powered-by");

// Routes
const authRoutes = require("./routes/authSql");
const adminRoutes = require("./routes/adminSql");
const bookingRoutes = require("./routes/bookingsSql");
const reviewRoutes = require("./routes/reviewsSql");
const serviceRoutes = require("./routes/servicesSql");
const workerRoutes = require("./routes/workersSql");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/workers", workerRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CoServe Backend API is running",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET must be configured in .env");
    await initializeDatabase();
    console.log("MySQL database ready ✅");

    app.listen(PORT, () => {
      console.log(`CoServe server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed ❌");
    console.error(error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };