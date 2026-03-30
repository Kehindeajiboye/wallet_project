const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { Users, Wallets, Otps, Tansactions, Ledgers } = require("../../models");
const { signupSchema } = require("../validations/authValidation");
const { generateOTP, expiredOTP } = require("../utils/utils");
const { sendMailToUser } = require("../services/emailServices");

const createNewUser = async (req, res) => {
  const { error, value } = signupSchema.validate(req.body);
  console.log("schema error", error);

  if (error) {
    res.status(400).json({
      status: false,
      message: error.details[0].message,
    });
  }

  try {
    const checkIfUserExists = await Users.findAll({
      where: { [Op.or]: [{ email: value.email }, { phone: value.phone }] },
    });

    if (checkIfUserExists.length > 0) {
      res.status(409).json({
        status: false,
        message: "User already exists",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(value.password, salt);
    const userId = uuidv4();

    await Users.create({
      userId: userId,
      firstName: value.firstName,
      lastName: value.lastName,
      email: value.email,
      phone: value.phone,
      salt_password: salt,
      hash_password: hash,
    });

    await Wallets.create({
      walletId: uuidv4(),
      userId: userId,
      balance: 0,
    });

    const otp_code = generateOTP();
    const expired_at = expiredOTP();

    await Otps.create({
      otpCode: otp_code,
      userId: userId,
      expiredAt: expired_at,
    });

    const payload = {
      fullname: `${value.firstName} ${value.lastName}`,
      otp_code: otp_code,
    };

    await sendMailToUser(
      value.email,
      "Welcome to Kenzo App",
      payload,
      "WelcomeTemplate",
    );

    res.status(201).json({
      status: true,
      message: "Check email for otp verification code",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Server error",
    });
  }
};

const verifyUserOTP = async (req, res) => {
  const { email } = req.params;
  const { otp_code } = req.body;

  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({
            status: false,
            message: "User not found"
        })  
    }

    
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  createNewUser,
  verifyUserOTP,
};
