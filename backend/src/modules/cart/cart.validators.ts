import Joi from "joi";

const cuidSchema = Joi.string().pattern(/^c[a-z0-9]{24}$/).required();

export const addToCartSchema = Joi.object({
  productId: cuidSchema,
  quantity: Joi.number().integer().min(1).required(),
});

export const productIdParamSchema = Joi.object({
  productId: cuidSchema,
});

export const updateCartItemSchema = Joi.object({
  delta: Joi.number().integer().not(0).required(),
});
