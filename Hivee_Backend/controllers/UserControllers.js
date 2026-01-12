const Hivee_User = require("../models/User"); // getting data sturcture of user in db
const bcrypt = require("bcryptjs"); // for password save
const jwt = require("jsonwebtoken"); // for making access state for user
const Hivee_OTP = require("../models/OTP"); // getting data sturcture of otp in db
const sendOTP = require("../utils/sendotp"); // function to send email

exports.SigningRequest = async (req, res) => {
  // function to send otp for signing request
  try {
    const { User_Name, User_Email, User_Password } = req.body; // getting the data
    //if any field is empty
    if (!User_Name || !User_Email || !User_Password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    const existingUser = await Hivee_User.findOne({
      $or: [{ User_Email }, { User_Name }], // checking is user already exists
    });

    if (existingUser) {
      // if yes then message be send that user already exists
      return res.status(400).json({
        success: false,
        message:
          existingUser.User_Email === User_Email
            ? "Email already exists"
            : "Username already exists",
      });
    }

    await Hivee_OTP.deleteMany({ User_Email }); //deleting old otp if any left

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // generating otp

    await Hivee_OTP.create({
      // creating otp in db
      User_Email,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    await sendOTP(User_Email, otp, "verification"); // sending email of otp verification

    return res.status(200).json({
      // making success
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error); // if any error occur

    return res.status(500).json({
      // happened by internet error
      success: false,
      message: "OTP sending failed",
    });
  }
};

exports.SigningVerify = async (req, res) => {
  // Verifying otp is correct and making the account
  try {
    const { User_Name, User_Email, User_Password, otp } = req.body; // getting the data

    const otpData = await Hivee_OTP.findOne({ User_Email }); // finding the otp of user email

    if (!otpData) {
      // if not found in db
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (otpData.expiresAt < Date.now()) {
      // if otp expires
      await Hivee_OTP.deleteOne({ User_Email });
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (otpData.otp !== otp) {
      // if user sended otp is not correct
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }
    //if all correct then
    const hashedPassword = await bcrypt.hash(User_Password, 10); //protecting the password

    await Hivee_User.create({
      // making the account
      User_Name: User_Name || "User",
      User_Email,
      User_Password: hashedPassword,
    });

    await Hivee_OTP.deleteOne({ User_Email }); // delete that otp

    return res.status(201).json({
      // success message as be send
      success: true,
      message: "Signup successful",
    });
  } catch (error) {
    return res.status(500).json({
      // internal server error
      success: false,
      message: "Signup failed",
    });
  }
};
exports.Password_Reset_requesting = async (req, res) => {
  // function for password reseting request
  try {
    const { User_Email } = req.body; // getting user email which password have to change
    if (!User_Email) {
      // if this filed is empty then return
      return res.status(400).json({
        success: false,
        message: "Please provide email",
      });
    }

    const user = await Hivee_User.findOne({ User_Email }); //checking if user exists in db if not return it
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Hivee_OTP.deleteMany({ User_Email }); //delete all the otp relatd to email
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // generate otp

    await Hivee_OTP.create({
      // creating otp in db
      User_Email,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    await sendOTP(User_Email, otp, "Password_Reset"); // sending email for verification

    return res.status(200).json({
      // success when otp is send
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    // internal server error
    return res.status(500).json({
      success: false,
      message: "OTP sending failed",
    });
  }
};
exports.Password_Reset_Verifying = async (req, res) => {
  // function for verification
  try {
    const { User_Email, otp } = req.body; // getting data for password reset

    if (!User_Email || !otp) {
      // if any field empty then return
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const OTP = await Hivee_OTP.findOne({ User_Email }); // finding the otp of the email

    if (!OTP) {
      // if otp not found in db
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (OTP.expiresAt < Date.now()) {
      // otp expires
      await Hivee_OTP.deleteOne({ User_Email }); // delete that otp
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (OTP.otp !== otp) {
      // when otp is not correct
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    await Hivee_OTP.deleteOne({ User_Email }); // delete the otp

    res.status(200).json({
      //success message as verification is done
      success: true,
      message: "OTP verified",
    });
  } catch (error) {
    // internal server error
    res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};
exports.Password_Reseting = async (req, res) => {
  // function for making new password
  try {
    const { User_Email, newPassword } = req.body; // getting the data & new password

    if (!User_Email || !newPassword) {
      // if any filed is empty return
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10); // protecting the new password

    await Hivee_User.updateOne(
      // updating the new password
      { User_Email },
      { User_Password: hashedPassword }
    );

    res.status(200).json({
      // success message after updating the password
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    // internal server error
    res.status(500).json({
      success: false,
      message: "Password reset failed",
    });
  }
};

exports.Logining = async (req, res) => {
  // login in the web page
  try {
    const { User_Email, User_Password } = req.body; // getting the dataW

    if (!User_Email || !User_Password) {
      // if any field is empty
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const HiveeUser = await Hivee_User.findOne({ User_Email }); // seeing if user is exist

    if (!HiveeUser) {
      // if user not found
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      // password  matching it
      User_Password,
      HiveeUser.User_Password
    );

    if (!passwordMatch) {
      // if password is not matched
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: HiveeUser._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    }); // making time period for stay logged in

    return res.status(200).json({
      // success after logging in
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
    console.error("LOGIN ERROR:", error); // internal server error
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getUser = async (req, res) => {
  // function for getting user data
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
