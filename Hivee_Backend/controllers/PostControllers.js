const Hivee_Post = require("../models/Post");

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
          createdAt: 1,
          hideLikesCount: 1,
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
