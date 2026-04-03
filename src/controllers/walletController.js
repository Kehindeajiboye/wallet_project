const { v4: uuidv4 } = require("uuid");
const { Users, Wallets, Otps, Tansactions, Ledgers } = require("../../models");

// const getUserWalletDetails = async (req, res) => {
//     const userId = req.user.userId;
//     try {
//         const walletDetails = await Wallets.findOne({
//             where: {userId: userId},
//             attributes: ["walletId", "balance"]
//         })
//         if (!walletDetails) {
//             return res.status(404).json({ error: "Wallet not found" });
//         }
//         res.json(walletDetails);
//     } catch (error) {
//         console.error("Error fetching wallet details:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

const getUserAcctDetails = async (req, res) => {
  const userId = req.user.userId;
  try {
    const userDetails = await Wallets.findOne({
      where: { userId },
    });

    if (!userDetails) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      status: true,
      data: {
        accountNumber: userDetails.accountNumber,
        balance: userDetails.balance,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  getUserAcctDetails,
};
