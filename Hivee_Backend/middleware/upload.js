const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/Cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video");

    return {
      folder: "hivee/posts",
      resource_type: "auto",
      allowed_formats: isVideo
        ? ["mp4", "mov", "avi", "webm"]
        : ["jpg", "jpeg", "png", "webp"],

      transformation: isVideo
        ? [
            {
              quality: "auto",
              fetch_format: "auto",
              video_codec: "auto",
              bit_rate: "1m",
            },
          ]
        : [
            {
              quality: "auto",
              fetch_format: "auto",
            },
          ],
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

module.exports = upload;
