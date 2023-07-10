const Joi = require("joi");
const MESSEGES = require("../messegesForValidation");

const editUserSchema = Joi.object({
  name: Joi.object()
    .keys({
      first: Joi.string().min(2).max(256).required(),
      last: Joi.string().min(2).max(256).required(),
    })
    .required(),
  gender: Joi.string().allow("male").allow("female").allow("other"),
  email: Joi.string()
    .pattern(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
    .messages({
      "string.pattern.base": MESSEGES.EMAIL,
    })
    .min(6)
    .max(256)
    .required(),
  image: Joi.object().keys({
    imageFile: Joi.any(),
    alt: Joi.string().min(2).max(256).required(),
  }),
});

const validateEditUserSchema = (userInput) =>
  editUserSchema.validateAsync(userInput);

module.exports = {
  validateEditUserSchema,
};
