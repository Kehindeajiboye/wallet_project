const express = require("express");
const { createNewUser, resendOTP, verifyUserOTP } = require("../controllers/usersController");
const router = express.Router();


router.post("/signup", createNewUser)
router.post("/verify-otp/:email", verifyUserOTP)
router.post("/resend-otp/:email", resendOTP)
module.exports = router