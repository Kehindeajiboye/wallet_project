const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { Users, Wallets, Otps, Transactions, Ledgers } = require("../../models");

const generateOTP = () => {
  return crypto.randomInt(100000, 1000000);
};

const expiredOTP = () => {
  return Date.now + 5 * 60 * 1000;
};

const generateUniqueAccountNumber = () => {
  const timeStamp = Date.now().toString().slice(-5);
  const randomDigits = crypto.randomInt(100, 1000).toString();
  return "30" + timeStamp + randomDigits;
};

const checkSenderBal = async (senderId, amount) => {
  const walBalance = await Wallets.findOne({ where: { senderId } });
  console.log("wallet", walBalance);
  if (!walBalance) {
    throw new Error("Wallet not found");
  }

  if (walBalance.balance < amount) {
    throw new Error("Insufficient Balance");
  }
};

const debitSenderWallet = async (senderId, recipientAccountNumber, amount) => {
  const senderDetails = await Wallets.findOne({ where: { userId: senderId } });
  const receiverDetails = await Wallets.findOne({
    where: { accountNumber: recipientAccountNumber },
  });
  await Wallets.decrement({ balance: amount }, { where: { userId: senderId } });
  await Transactions.create({
    transactionRef: uuidv4(),
    senderWalletId: senderDetails.walletId,
    receiverWalletId: receiverDetails.walletId,
    amount: amount
  });
};

const creditReceiverWallet = async (senderId, recipientAccountNumber, amount) => {
  await Wallets.increment({ balance: amount }, { where: { accountNumber: recipientAccountNumber } });
  const receiverDetails = await Wallets.findOne({
    where: { accountNumber: recipientAccountNumber },
  });
  const senderDetails = await Wallets.findOne({ where: { userId: senderId } });
  await Ledgers.create({
    ledgerRef: uuidv4(),
    walletId: receiverDetails.walletId,
    amount: amount,
    type: "credit",
    balanceAfter: receiverDetails.balance
  });

  await Ledgers.create({
    ledgerRef: uuidv4(),
    walletId: senderDetails.walletId,
    amount: amount,
    type: "debit",
    balanceAfter: senderDetails.balance
  })
};

module.exports = {
  generateOTP,
  expiredOTP,
  generateUniqueAccountNumber,
  checkSenderBal,
  debitSenderWallet,
  creditReceiverWallet
};
