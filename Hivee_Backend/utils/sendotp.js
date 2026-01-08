const nodemailer = require("nodemailer");

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Hivee" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Hivee Email Verification OTP",
    text: `Your Hivee OTP is ${otp}. It expires in 10 minutes.`,
  });
};

module.exports = sendOTP;
