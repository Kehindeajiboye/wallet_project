const Joi = require("joi");

const signupSchema = Joi.object({
  firstName: Joi.string().min(3).max(30).required().messages({
    "string.base": "firstName should be a type of text",
    "string.empty": "firstName should not be empty",
    "string.min": "firstName should have a minimum character of 3",
    "string.max": "firstName should have a maximum character of 30",
    "any.required": "firstName is a required field",
  }),
  lastName: Joi.string().min(3).max(30).required().messages({
    "string.base": "lastName should be a type of text",
    "string.empty": "lastName should not be empty",
    "string.min": "lastName should have a minimum character of 3",
    "string.max": "lastName should have a maximum character of 30",
    "any.required": "lastName is a required field",
  }),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required().messages({
      "string.empty": "email cannot be empty",
      "string.email": "email must be a valid email",
      "any.required": "email is a required field",
    }),
  password: Joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])")).min(8).required().messages({
      "string.pattern.base": "password must contain uppercase, lowercase and number",
      "string.min": "password must be at least 8 characters long",
      "string.empty": "password cannot be empty",
      "any.required": "password is a required field",
    }),
  phone: Joi.string().max(15).required().messages({
    "string.empty": "phone cannot be empty",
    "string.max": "phone must be a maximum of 15",
    "any.required": "phone is a required field",
  }),
});

const completeSignupSchema = Joi.object({
  otp: Joi.string().length(6).required().messages({
    "string.base": "otp should be a type of text",
    "string.empty": "otp should not be empty",
    "string.length": "otp should be 6 characters long",
    "any.required": "otp is a required field",
  }),
})

const loginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }).required().messages({
      "string.empty": "email cannot be empty",
      "string.email": "email must be a valid email",
      "any.required": "email is a required field",
    }),
  password: Joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])")).required().messages({
      "string.pattern.base": "password must contain uppercase, lowercase and number",
      "string.min": "password must be at least 8 characters long",
      "string.empty": "password cannot be empty",
      "any.required": "password is a required field",
    }),
});



module.exports = {
  signupSchema,
  completeSignupSchema,
  loginSchema
}