const  express = require("express");
const { getUserAcctDetails, transferFunds, startFundWallet, completeFundWallet } = require("../controllers/walletController");
const { authenticateToken } = require("../middleware/authentication");
const router = express.Router();


router.get("/get-wallet", authenticateToken, getUserAcctDetails);
router.post("/transfer-funds", authenticateToken, transferFunds);
router.post("/start-fund-wallet", authenticateToken, startFundWallet);
router.get("/complete-fund-wallet/:reference", authenticateToken, completeFundWallet);

module.exports = router;