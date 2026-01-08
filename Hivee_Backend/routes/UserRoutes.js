const express = require("express");
const {
  SigningRequest,
  SigningVerify,
  Logining,
  getUser,
} = require("../controllers/UserControllers");
const { protect } = require("../middleware/Protection");
const router = express.Router();

router.post("/signup-request", SigningRequest);
router.post("/signup-verify", SigningVerify);
router.post("/login", Logining);
router.get("/me", protect, getUser);

module.exports = router;
