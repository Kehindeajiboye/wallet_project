const  express = require("express");
const { getUserAcctDetails } = require("../controllers/walletController");
const router = express.Router();


router.get("/get-wallet", getUserAcctDetails);

module.exports = router;