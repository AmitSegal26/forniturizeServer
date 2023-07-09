const Joi = require("joi");

const createCardSchema = Joi.object({
  title: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(1024).required(),
  stock: Joi.array().items(
    Joi.array().items(
      Joi.object({
        size: Joi.object({
          height: Joi.number(),
          width: Joi.number(),
          length: Joi.number(),
          price: Joi.number(),
        }),
        color: Joi.string(),
        stock: Joi.number(),
      })
    )
  ),
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
