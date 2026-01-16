const express = require("express");
const { Making_Post } = require("../controllers/PostControllers");
const { protect } = require("../middleware/Protection");
const upload = require("../middleware/upload");
const router = express.Router();

router.post("/making-post", protect, upload.single("media"), Making_Post);

module.exports = router;
