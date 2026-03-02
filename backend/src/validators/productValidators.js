import Joi from "joi";

export const objectIdParamSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().max(2000).allow(""),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).default(0),
  category: Joi.string().trim().max(80).allow(""),
  images: Joi.array().items(Joi.string().trim()).default([]),
  inStock: Joi.boolean().optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  description: Joi.string().trim().max(2000).allow(""),
  price: Joi.number().min(0),
  stock: Joi.number().integer().min(0),
  category: Joi.string().trim().max(80).allow(""),
  images: Joi.array().items(Joi.string().trim()),
  inStock: Joi.boolean(),
}).min(1);
