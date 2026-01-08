const Hivee_User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Hivee_OTP = require("../models/OTP");
const sendOTP = require("../utils/sendotp");

exports.SigningRequest = async (req, res) => {
  try {
    const { User_Name, User_Email, User_Password } = req.body;
    if (!User_Name || !User_Email || !User_Password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    await Hivee_OTP.deleteMany({ User_Email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Hivee_OTP.create({
      User_Email,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    await sendOTP(User_Email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);

    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${
          field === "User_Email" ? "Email" : "Username"
        } already exists`,
      });
    }

    return res.status(500).json({
      success: false,
      message: "OTP sending failed",
    });
  }
};

exports.SigningVerify = async (req, res) => {
  try {
    const { User_Name, User_Email, User_Password, otp } = req.body;

    const otpData = await Hivee_OTP.findOne({ User_Email });

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (otpData.expiresAt < Date.now()) {
      await Hivee_OTP.deleteOne({ User_Email });
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(User_Password, 10);

    await Hivee_User.create({
      User_Name: User_Name || "User",
      User_Email,
      User_Password: hashedPassword,
    });

    await Hivee_OTP.deleteOne({ User_Email });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};

exports.Logining = async (req, res) => {
  try {
    const { User_Email, User_Password } = req.body;

    if (!User_Email || !User_Password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const HiveeUser = await Hivee_User.findOne({ User_Email });

    if (!HiveeUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      User_Password,
      HiveeUser.User_Password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: HiveeUser._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    return res.status(200).json({
      success: true,
      message: "Welcome Back",
      token,
      Hiveeuser: {
        id: HiveeUser._id,
        User_Name: HiveeUser.User_Name,
        User_Email: HiveeUser.User_Email,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
