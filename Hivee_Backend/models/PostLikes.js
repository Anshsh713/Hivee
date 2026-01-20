const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
  {
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hivee_User",
      required: true,
      index: true,
    },

    PostID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hivee_Post",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

LikeSchema.index({ UserID: 1, PostID: 1 }, { unique: true });

module.exports = mongoose.model("Hivee_Post_Likes", LikeSchema);
