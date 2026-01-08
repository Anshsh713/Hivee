const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  User_Email: String,
  otp: String,
  expiresAt: Date,
});

module.exports = mongoose.model("Hivee_OTP", OTPSchema);
