const { v4: uuidv4 } = require("uuid");
const { Users, Wallets, Otps, Transactions, Ledgers } = require("../../models");
const {
  debitSenderWallet,
  creditReceiverWallet,
  checkSenderBal,
} = require("../utils/utils");
const {
  transferSchema,
  fundWalletSchema,
} = require("../validations/walletValidation");
const {
  initializePayment,
  verifyPayment,
} = require("../services/paystackServices");
const { sendMailToUser } = require("../services/emailServices");

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

const startFundWallet = async (req, res) => {
  const userEmail = req.user.email;
  const { error, value } = fundWalletSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details[0].message,
    });
  }

  try {
    const user = await Users.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
    data = {
      email: userEmail,
      amount: value.amount,
    };
    const response = await initializePayment(data);
    if (!response.data.status) {
      return res.status(400).json({
        status: false,
        message: "Payment initialization failed",
      });
    }
    res.status(200).json({
      status: true,
      message: "Payment initialized",
      data: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Server error",
    });
  }
};

const completeFundWallet = async (req, res) => {
  const userId = req.user.userId;
  const { reference } = req.params;

  try {
    const checkIfReferenceExists = await Transactions.findOne({
      where: { transactionRef: reference },
    });
    if (checkIfReferenceExists) {
      return res.status(400).json({
        status: false,
        message: "Transaction has already been processed",
      });
    }

    const response = await verifyPayment(reference);
    if (!response.data.status) {
      return res.status(400).json({
        status: false,
        message: "Payment verification failed",
      });
    }

    await Wallets.increment(
      { balance: response.data.data.amount / 100 },
      { where: { userId } },
    );

    const wallet = await Wallets.findOne({ where: { userId } });

    await Transactions.create({
      transactionRef: reference,
      senderWalletId: null,
      receiverWalletId: wallet.walletId,
      amount: response.data.data.amount / 100,
      status: "completed",
    });

    await Ledgers.create({
      ledgerRef: uuidv4(),
      walletId: wallet.walletId,
      amount: response.data.data.amount / 100,
      type: "credit",
      balanceAfter: wallet.balance,
    });

    res.status(200).json({
      status: true,
      message: "Wallet funded successfully",
    });
  } catch (error) {
    return res.status(500).json({
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
  const t = await sequelize.transaction();

  try {
    const recipientWallet = await Wallets.findOne({
      where: { accountNumber: recipientAccountNumber },
    });

    if (!recipientWallet) {
      return res.status(404).json({
        status: false,
        message: "Recipient wallet not found",
      });
    }

    const receiverDetails = await Users.findOne({
      where: { userId: recipientWallet.userId },
    });

    const senderDetails = await Users.findOne({ where: { userId: senderId } });

    await checkSenderBal(senderId, amount);

    const transaction = await debitSenderWallet(
      senderId,
      recipientAccountNumber,
      amount,
      t
    );

    await creditReceiverWallet(senderId, recipientAccountNumber, amount, t);
    await transaction.update({ status: "completed" }, { transaction: t });

    const payloadReceiver = {
      amount: amount,
      status: "credited",
      type: "Credit",
    };

    const payloadSender = {
      amount: amount,
      status: "debited",
      type: "Debit",
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

    await t.commit();

    res.status(200).json({
      status: true,
      message: "Transfer successful",
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      status: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  getUserAcctDetails,
  transferFunds,
  startFundWallet,
  completeFundWallet,
};
