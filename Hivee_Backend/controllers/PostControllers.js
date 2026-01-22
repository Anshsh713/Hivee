const Hivee_Post = require("../models/Post");
const mongoose = require("mongoose");
const Hivee_Post_Likes = require("../models/PostLikes");
const Hivee_Post_Saves = require("../models/PostSaved");

exports.Making_Post = async (req, res) => {
  try {
    const {
      Post_Type,
      Caption,
      Location,
      Collaborators,
      hideLikesCount,
      disableComments,
    } = req.body;

    let mediaURL = null;
    if (Post_Type === "Text" && !Caption) {
      return res.status(400).json({
        success: false,
        message: "Caption is Required",
      });
    }
    if (!Post_Type) {
      return res.status(400).json({
        success: false,
        message: "Post type is Required",
      });
    }

    if (Post_Type !== "Text" && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Media is required for image/video posts",
      });
    }

    if ((Post_Type === "Image" || Post_Type === "Video") && req.file) {
      mediaURL = req.file.path;
    }

    const posting = await Hivee_Post.create({
      UserID: req.user._id,
      Post_Type,
      Caption,
      mediaURL,
      Location: Location || null,
      Collaborators: Collaborators || null,
      hideLikesCount: hideLikesCount === true || hideLikesCount === "true",
      disableComments: disableComments === true || disableComments === "true",
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      posting,
    });
  } catch (error) {
    console.error("CREATE POST ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
};

exports.getHomeFeed = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const feed = await Hivee_Post.aggregate([
      {
        $match: {
          isDeleted: false,
          Post_Type: { $in: ["Image", "Video"] },
        },
      },
      {
        $addFields: {
          recencyScore: {
            $divide: [
              { $subtract: [new Date(), "$createdAt"] },
              1000 * 60 * 60,
            ],
          },
        },
      },
      {
        $addFields: {
          feedScore: {
            $subtract: [
              {
                $add: [
                  { $multiply: ["$likesCount", 2] },
                  { $multiply: ["$commentsCount", 3] },
                ],
              },
              "$recencyScore",
            ],
          },
        },
      },
      {
        $lookup: {
          from: "hivee_post_likes",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$PostID", "$$postId"] },
                    {
                      $eq: [
                        "$UserID",
                        new mongoose.Types.ObjectId(req.user._id),
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "myLike",
        },
      },
      {
        $lookup: {
          from: "hivee_post_saves",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$PostID", "$$postId"] },
                    {
                      $eq: [
                        "$UserID",
                        new mongoose.Types.ObjectId(req.user._id),
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "mySaves",
        },
      },
      {
        $addFields: {
          isLikedByMe: { $gt: [{ $size: "$myLike" }, 0] },
        },
      },
      {
        $addFields: {
          isSavedByMe: { $gt: [{ $size: "$mySaves" }, 0] },
        },
      },
      { $sort: { feedScore: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "hivee_users",
          localField: "UserID",
          foreignField: "_id",
          as: "User",
        },
      },
      {
        $unwind: "$User",
      },
      {
        $project: {
          Caption: 1,
          mediaURL: 1,
          Post_Type: 1,
          likesCount: 1,
          commentsCount: 1,
          SavedCount: 1,
          createdAt: 1,
          hideLikesCount: 1,
          isLikedByMe: 1,
          isSavedByMe: 1,
          "User._id": 1,
          "User.User_Name": 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      page,
      posts: feed,
      hasMore: feed.length === limit,
    });
  } catch (error) {
    console.error("FEED ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load feed",
    });
  }
};

exports.getThoughtsFeed = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const feed = await Hivee_Post.aggregate([
      {
        $match: {
          isDeleted: false,
          Post_Type: { $in: ["Text"] },
        },
      },
      {
        $addFields: {
          recencyScore: {
            $divide: [
              { $subtract: [new Date(), "$createdAt"] },
              1000 * 60 * 60,
            ],
          },
        },
      },
      {
        $addFields: {
          feedScore: {
            $subtract: [
              {
                $add: [
                  { $multiply: ["$likesCount", 2] },
                  { $multiply: ["$commentsCount", 3] },
                ],
              },
              "$recencyScore",
            ],
          },
        },
      },
      {
        $lookup: {
          from: "hivee_post_likes",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$PostID", "$$postId"] },
                    {
                      $eq: [
                        "$UserID",
                        new mongoose.Types.ObjectId(req.user._id),
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "myLike",
        },
      },
      {
        $lookup: {
          from: "hivee_post_saves",
          let: { postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$PostID", "$$postId"] },
                    {
                      $eq: [
                        "$UserID",
                        new mongoose.Types.ObjectId(req.user._id),
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: "mySaves",
        },
      },
      {
        $addFields: {
          isLikedByMe: { $gt: [{ $size: "$myLike" }, 0] },
        },
      },
      {
        $addFields: {
          isSavedByMe: { $gt: [{ $size: "$mySaves" }, 0] },
        },
      },
      { $sort: { feedScore: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "hivee_users",
          localField: "UserID",
          foreignField: "_id",
          as: "User",
        },
      },
      {
        $unwind: "$User",
      },
      {
        $project: {
          Caption: 1,
          mediaURL: 1,
          Post_Type: 1,
          likesCount: 1,
          commentsCount: 1,
          SavedCount: 1,
          createdAt: 1,
          hideLikesCount: 1,
          isLikedByMe: 1,
          isSavedByMe: 1,
          "User._id": 1,
          "User.User_Name": 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      page,
      posts: feed,
      hasMore: feed.length === limit,
    });
  } catch (error) {
    console.error("FEED ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load feed",
    });
  }
};

exports.PostLikes = async (req, res) => {
  try {
    const { PostID } = req.params;

    const post = await Hivee_Post.findById(PostID);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not Found",
      });
    }

    const existingLike = await Hivee_Post_Likes.findOne({
      UserID: req.user._id,
      PostID,
    });

    if (existingLike) {
      await Hivee_Post_Likes.deleteOne({ _id: existingLike._id });

      await Hivee_Post.findByIdAndUpdate(PostID, {
        $inc: { likesCount: -1 },
      });

      return res.status(200).json({
        success: true,
        message: "Post unliked",
      });
    }

    await Hivee_Post_Likes.create({ UserID: req.user._id, PostID });

    await Hivee_Post.findByIdAndUpdate(PostID, {
      $inc: { likesCount: 1 },
    });

    return res.status(200).json({
      success: true,
      message: "Post liked",
    });
  } catch (error) {
    console.error("LIKE ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Post already liked",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Like operation failed",
    });
  }
};

exports.PostSaved = async (req, res) => {
  try {
    const { PostID } = req.params;

    const post = await Hivee_Post.findById(PostID);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const existingSaved = await Hivee_Post_Saves.findOne({
      UserID: req.user._id,
      PostID,
    });

    if (existingSaved) {
      await Hivee_Post_Saves.deleteOne({ _id: existingSaved._id });

      await Hivee_Post.findByIdAndUpdate(PostID, {
        $inc: { SavedCount: -1 },
      });

      return res.status(200).json({
        success: true,
        message: "Post Unsaved",
      });
    }

    await Hivee_Post_Saves.create({ UserID: req.user._id, PostID });

    await Hivee_Post.findByIdAndUpdate(PostID, {
      $inc: { SavedCount: 1 },
    });

    return res.status(200).json({
      success: true,
      message: "Post Saved",
    });
  } catch (error) {
    console.error("Saved Error : ", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Post already Saved",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Saved operation failed",
    });
  }
};
