const Joi = require("joi");
const HELPER = require("../helpersForValidations");

const createCardSchema = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  stock: Joi.array()
    .items(
      Joi.array().items(
        Joi.object({
          size: Joi.object({
            height: Joi.number(),
            width: Joi.number(),
            length: Joi.number(),
          }),
          price: Joi.number(),
          color: Joi.string().pattern(HELPER.REGEXES.COLOR).messages({
            "string.pattern.base": HELPER.MESSEGES.COLOR,
          }),
          cart: Joi.array().items(Joi.string()),
          stock: Joi.number(),
        })
      )
    )
    .required(),
  image: Joi.object().keys({
    imageFile: Joi.any(),
    alt: Joi.string().min(2).max(256).required(),
  }),
});

const validateCardSchema = (userInput) => {
  return createCardSchema.validateAsync(userInput);
};

module.exports = {
  validateCardSchema,
};
