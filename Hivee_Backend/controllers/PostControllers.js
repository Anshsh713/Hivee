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
