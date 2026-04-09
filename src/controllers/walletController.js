const { v4: uuidv4 } = require("uuid");
const { Users, Wallets, Otps, Transactions, Ledgers } = require("../../models");
const { debitSenderWallet, creditReceiverWallet } = require("../utils/utils");

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

// const getUserTransactionHistory = async (req, res) => {
//   const userId = req.user.userId;
//   try {    const transactions = await Tansactions.findAll({
//       where: { userId },
//         include: [
//             {
//                 model: Ledgers,
//                 attributes: ["transactionType", "amount", "transactionDate"]
//             }
//         ]
//     });
//     res.status(200).json({
//       status: true,
//       data: transactions
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: false,
//       message: error.message || "Server error"
//     });
//   }
// };

const transferFunds = async (req, res) => {
  const senderId = req.user.userId;
  const { error, value } = transferSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details[0].message,
    });
  }

  const { recipientAccountNumber, amount } = value;

  try {
    const recipientWallet = await Wallets.findOne({
      where: { accountNumber: recipientAccountNumber },
    });

    const receiverDetails = await Users.findOne({
      where: { userId: recipientWallet.userId },
    });

    const senderDetails = await Users.findOne({ where: { userId: senderId } });

    if (!recipientWallet) {
      res.status(404).json({
        status: false,
        message: "Recipient wallet not found",
      });
    }

    await checkSenderBal(senderId, amount);

    const transaction = await debitSenderWallet(
      senderId,
      recipientAccountNumber,
      amount,
    );

    await creditReceiverWallet(senderId, recipientAccountNumber, amount);
    await transaction.update({ status: "completed" });

    const payloadReceiver = {
      amount: amount,
      status: "credited",
      type: "Credit"
    };

    const payloadSender = {
      amount: amount,
      status: "debited",
      type: "Debit"
    };

    await sendMailToUser(
      receiverDetails.email,
      "Wallet Credited",
      payloadReceiver,
      "TransferTemplate",
    );

    await sendMailToUser(
      senderDetails.email,
      "Wallet Debited",
      payloadSender,
      "TransferTemplate",
    );

    res.status(200).json({
      status: true,
      message: "Transfer successful",
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
  transferFunds,
};
