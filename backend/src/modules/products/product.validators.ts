import Joi from "joi";

const cuidSchema = Joi.string().pattern(/^c[a-z0-9]{24}$/).required(); // cuid is a 24 character string starting with c and containing only lowercase letters and numbers

export const productIdParamSchema = Joi.object({
  id: cuidSchema,
});

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().max(2000).allow(""),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).default(0),
  category: Joi.string().trim().max(80).allow(""),
  brand: Joi.string().trim().max(80).allow(""),
  images: Joi.array().items(Joi.string().trim()).default([]),
  inStock: Joi.boolean().optional(),
  featured: Joi.boolean().optional(),
  rating: Joi.number().min(0).max(5).optional(),
  numReviews: Joi.number().integer().min(0).optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  description: Joi.string().trim().max(2000).allow(""),
  price: Joi.number().min(0),
  stock: Joi.number().integer().min(0),
  category: Joi.string().trim().max(80).allow(""),
  brand: Joi.string().trim().max(80).allow(""),
  images: Joi.array().items(Joi.string().trim()),
  inStock: Joi.boolean(),
  featured: Joi.boolean(),
  rating: Joi.number().min(0).max(5),
  numReviews: Joi.number().integer().min(0),
}).min(1);
