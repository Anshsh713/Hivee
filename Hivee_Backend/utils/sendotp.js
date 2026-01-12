const nodemailer = require("nodemailer"); // bot for send emails to user for otp verification

const sendOTP = async (email, otp, type) => {
  // function of parameters email , otp , type (for which prepose this otp is sending)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // this transporter takes the sender email for sending emails
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  if (type === "verification") {
    // If user signing
    // this email be send
    await transporter.sendMail({
      from: `"Hivee" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Hivee Email Verification OTP",
      text: `Your Hivee OTP is ${otp}. It expires in 10 minutes.`,
    });
  } else if (type === "Password_Reset") {
    //If user changing his password
    //this email be send
    await transporter.sendMail({
      from: `"Hivee" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Verification Reset OTP",
      text: `Your Hivee OTP is ${otp}. It expires in 10 minutes.`,
    });
  }
};

module.exports = sendOTP; // name be used to use this function
