import Joi from "joi";

export const addToCartSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
  quantity: Joi.number().integer().min(1).required(),
});

export const productIdParamSchema = Joi.object({
  productId: Joi.string().hex().length(24).required(),
});
