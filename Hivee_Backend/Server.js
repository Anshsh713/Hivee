require("dotenv").config();
const express = require("express");
const cors = require("cors");
const MongoDB_Connecting = require("./config/MongoDB_connect");
const UserRoutes = require("./routes/UserRoutes");

const Hivee = express();

// Middleware
Hivee.use(cors());
Hivee.use(express.json());
Hivee.use(express.urlencoded({ extended: true }));

// Database
MongoDB_Connecting();

// Routes
Hivee.use("/user", UserRoutes);

// 404 Handler
Hivee.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// Global Error Handler
Hivee.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start Server
Hivee.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
