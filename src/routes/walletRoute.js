const  express = require("express");
const { getUserAcctDetails, transferFunds } = require("../controllers/walletController");
const { authenticateToken } = require("../middleware/authentication");
const router = express.Router();


router.get("/get-wallet", authenticateToken, getUserAcctDetails);
router.post("/transfer-funds", authenticateToken, transferFunds);

module.exports = router;