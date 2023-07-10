const Joi = require("joi");
const MESSEGES = require("../messegesForValidation");

const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
    .messages({
      "string.pattern.base": MESSEGES.EMAIL,
    })
    .min(6)
    .max(256)
    .required(),
  password: Joi.string()
    .pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    .messages({
      "string.pattern.base": MESSEGES.PASSWORD,
    })
    .required(),
});

const validateLoginSchema = (userInput) => loginSchema.validateAsync(userInput);

module.exports = {
  validateLoginSchema,
};
