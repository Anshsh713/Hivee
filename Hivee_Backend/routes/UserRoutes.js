const express = require("express"); // getting express for making api
const {
  // getting all the functions from usercontrollers
  SigningRequest,
  SigningVerify,
  Logining,
  getUser,
  Password_Reset_requesting,
  Password_Reset_Verifying,
  Password_Reseting,
} = require("../controllers/UserControllers");
const { protect } = require("../middleware/Protection"); // getting protect
const router = express.Router(); // getting router
// making routing for all the api
router.post("/signup-request", SigningRequest);
router.post("/signup-verify", SigningVerify);
router.post("/password-Reset-requesting", Password_Reset_requesting);
router.post("/password-Reset-Verifying", Password_Reset_Verifying);
router.post("/password-Reseting", Password_Reseting);
router.post("/login", Logining);
router.get("/me", protect, getUser);

module.exports = router;
