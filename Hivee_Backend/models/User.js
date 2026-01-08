const mongoose = require("mongoose");

const Hivee_User_Information = new mongoose.Schema(
  {
    User_Name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    User_Email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    User_Password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hivee_User", Hivee_User_Information);
