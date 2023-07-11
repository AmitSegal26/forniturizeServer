const Joi = require("joi");
const HELPER = require("../helpersForValidations");

const createCardSchema = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  stock: Joi.array()
    .items(
      Joi.array()
        .items(
          Joi.object({
            size: Joi.object({
              height: Joi.number().min(0).required(),
              width: Joi.number().min(0).required(),
              length: Joi.number().min(0).required(),
            }).required(),
            price: Joi.number().min(0).required(),
            color: Joi.string()
              .pattern(HELPER.REGEXES.COLOR)
              .messages({
                "string.pattern.base": HELPER.MESSEGES.COLOR,
              })
              .required(),
            stock: Joi.number().min(0).required(),
          }).required()
        )
        .required()
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
