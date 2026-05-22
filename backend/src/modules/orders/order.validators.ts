import Joi from "joi";

const cuidSchema = Joi.string().pattern(/^c[a-z0-9]{24}$/).required();

export const orderIdParamSchema = Joi.object({
  id: cuidSchema,
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string().valid("PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED").required(),
});
