const mongoose = require("mongoose");

const Hivee_Posting = new mongoose.Schema(
  {
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hivee_User",
      required: true,
      index: true,
    },

    Post_Type: {
      type: String,
      enum: ["Text", "Image", "Video"],
      required: true,
    },

    Caption: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    mediaURL: {
      type: String,
    },

    Location: {
      type: String,
    },

    Collaborators: {
      type: String,
    },

    likesCount: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    hideLikesCount: {
      type: Boolean,
      default: false,
    },

    disableComments: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hivee_Post", Hivee_Posting);
