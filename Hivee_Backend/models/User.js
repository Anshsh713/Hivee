const mongoose = require("mongoose"); //calling monogodb for making the structure of user data

const Hivee_User_Information = new mongoose.Schema( // it is function for it
  {
    User_Name: {
      // User name in this state
      type: String, // data be in string
      required: true, // it be required
      unique: true, // data should be unique
      index: true, // index is used for fast getting the data
    },
    User_Email: {
      // User email in this state
      type: String, // data be in string
      required: true, // it be required
      unique: true, // data should be unique
      index: true, // index is used for fast getting the data
    },
    User_Password: {
      // User password in this state
      type: String, // data be in string
      required: true, // it be required
    },
  },
  { timestamps: true } // for get information that when this user make the account
);

module.exports = mongoose.model("Hivee_User", Hivee_User_Information); //database as been created on the mongodb
