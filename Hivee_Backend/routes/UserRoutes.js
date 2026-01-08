const express = require("express");
const {
  Signing,
  Logining,
  getUser,
} = require("../controllers/UserControllers");
const { protect } = require("../middleware/Protection");
const router = express.Router();

router.post("/signup", Signing);
router.post("/login", Logining);
router.get("/me", protect, getUser);

module.exports = router;
