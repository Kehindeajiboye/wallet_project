require("dotenv").config();
const axios = require("axios");


const initializePayment = async (payload) => {
    return axios({
        method: "POST",
        url: `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`,
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json"
        },
        data: {
            email: payload.email,
            amount: parseInt(payload.amount) * 100 // Paystack expects amount in kobo
        }
    })
}

const verifyPayment = async (reference) => {
    return axios({
        method: "GET",
        url: `${process.env.PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json"
        }
    })
}


module.exports = {
    initializePayment,
    verifyPayment
}