const Joi = require("joi");

const transferSchema = Joi.object({
    recipientAccountNumber: Joi.string().length(10).required().messages({
        "string.base": "recipientAccountNumber should be a type of text",
        "string.empty": "recipientAccountNumber should not be empty",
        "string.length": "recipientAccountNumber should be 10 characters long",
        "any.required": "recipientAccountNumber is a required field"
    }),
    amount: Joi.number().positive().required().messages({
        "number.base": "amount should be a type of number",
        "number.empty": "amount should not be empty",
        "number.positive": "amount should be a positive number",
        "any.required": "amount is a required field"
    })
});

const fundWalletSchema = Joi.object({
    amount: Joi.number().positive().required().messages({
        "number.base": "amount should be a type of number",
        "number.empty": "amount should not be empty",
        "number.positive": "amount should be a positive number",
        "any.required": "amount is a required field"
    })
});


module.exports = {
    transferSchema,
    fundWalletSchema
}