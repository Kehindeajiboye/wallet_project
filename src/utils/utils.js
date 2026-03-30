const crypto = require("crypto");

const generateOTP = () => {
  return crypto.randomInt(100000, 1000000);
}

const expiredOTP = () => {
    return Date.now + 5 * 60 * 1000
}

module.exports = {
    generateOTP,
    expiredOTP
}