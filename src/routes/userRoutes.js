const express = require("express");
const { createNewUser } = require("../controllers/usersController");
const router = express.Router();


router.post("/signup", createNewUser)

module.exports = router