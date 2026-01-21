const express = require("express");
const {
  Making_Post,
  getHomeFeed,
  PostLikes,
  PostSaved,
} = require("../controllers/PostControllers");
const { protect } = require("../middleware/Protection");
const upload = require("../middleware/upload");
const router = express.Router();

router.post("/making-post", protect, upload.single("media"), Making_Post);
router.get("/feed", protect, getHomeFeed);
router.post("/likes/:PostID", protect, PostLikes);
router.post("/saves/:PostID", protect, PostSaved);

module.exports = router;
