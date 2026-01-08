const Hivee_User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.Signing = async (req, res) => {
  try {
    const { User_Name, User_Email, User_Password } = req.body;

    if (!User_Name || !User_Email || !User_Password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    const hashedPassword = await bcrypt.hash(User_Password, 10);

    const New_Hivee_User = await Hivee_User.create({
      User_Name,
      User_Email,
      User_Password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: New_Hivee_User._id,
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
      message: "Internal server error",
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
