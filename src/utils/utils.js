const crypto = require("crypto");

const generateOTP = () => {
  return crypto.randomInt(100000, 1000000);
}

const expiredOTP = () => {
    return Date.now + 5 * 60 * 1000
}

const generateUniqueAccountNumber = () => {
    const timeStamp = Date.now().toString().slice(-5)
    const randomDigits = crypto.randomInt(100, 1000).toString()
    return "30" + timeStamp + randomDigits
}

module.exports = {
    generateOTP,
    expiredOTP,
    generateUniqueAccountNumber
}