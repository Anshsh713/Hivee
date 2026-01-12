const mongoose = require("mongoose"); //calling monogodb for making the structure of user data

const OTPSchema = new mongoose.Schema({
  // it is function for it
  User_Email: String, //OTP is saving on user email
  otp: String, //data be in string
  expiresAt: Date, // otp be expires as time out
});

module.exports = mongoose.model("Hivee_OTP", OTPSchema); // OTP database in mongodb
