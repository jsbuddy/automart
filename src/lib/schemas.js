import Joi from '@hapi/joi';

export const userSignupSchema = {
  body: Joi.object({
    email: Joi.string().lowercase().trim().required(),
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    password: Joi.string().required(),
    address: Joi.string().trim().required(),
    isAdmin: Joi.bool().default(false),
  }).unknown(true),
};

export const userSigninSchema = {
  body: Joi.object({
    email: Joi.string().lowercase().trim().required(),
    password: Joi.string().required(),
  }).unknown(true),
};

export const carGetSchema = {
  query: Joi.object({
    status: Joi.string().trim(),
    state: Joi.string().trim(),
    bodyType: Joi.string().trim(),
    minPrice: Joi.string().trim(),
    maxPrice: Joi.string().trim(),
    manufacturer: Joi.string().trim(),
  }).unknown(true),
};

export const carPostSchema = {
  body: Joi.object({
    state: Joi.string().valid('new', 'used').required(),
    price: Joi.number().required(),
    manufacturer: Joi.string().trim().required(),
    model: Joi.string().trim().required(),
    bodyType: Joi.string().valid('car', 'truck', 'trailer', 'van', 'sedan', 'hatchback', 'convertible', 'minivan', 'coupe', 'station wagon').required(),
    status: Joi.string().valid('available', 'sold').default('available'),
  }).unknown(true),
};

export const carPatchSchema = {
  body: Joi.object({
    state: Joi.string().valid('new', 'used'),
    price: Joi.number(),
    status: Joi.string().valid('available', 'sold'),
  }).unknown(true),
};

export const carPatchPriceSchema = {
  body: Joi.object({
    price: Joi.number().required(),
  }).unknown(true),
};

export const carPatchStatusSchema = {
  body: Joi.object({
    status: Joi.string().valid('available', 'sold').required(),
  }).unknown(true),
};

export const orderSchema = {
  body: Joi.object({
    carId: Joi.string().trim().required(),
    price: Joi.number(),
    amount: Joi.number(),
    status: Joi.string().valid('pending', 'accepted', 'rejected').default('pending'),
  }).unknown(true),
};

export const orderPatchSchema = {
  body: Joi.object({
    price: Joi.number(),
    status: Joi.string().valid('pending', 'accepted', 'rejected'),
  }).unknown(true),
};

export const orderPricePatchSchema = {
  body: Joi.object({
    price: Joi.number().required(),
  }).unknown(true),
};

export const flagSchema = {
  body: Joi.object({
    carId: Joi.string().trim().required(),
    reason: Joi.string().valid('pricing', 'weird demands').required(),
    description: Joi.string().trim().required(),
  }).unknown(true),
};
