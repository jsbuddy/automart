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
  body: {
    email: Joi.string().lowercase().trim().required(),
    password: Joi.string().required(),
  },
};

export const carGetSchema = {
  query: {
    status: Joi.string().trim(),
    state: Joi.string().trim(),
    bodyType: Joi.string().trim(),
    minPrice: Joi.string().trim(),
    maxPrice: Joi.string().trim(),
    manufacturer: Joi.string().trim(),
  },
};

export const carPostSchema = {
  body: Joi.object({
    state: Joi.string().valid('new', 'used').required(),
    price: Joi.number().required(),
    manufacturer: Joi.string().trim().required(),
    model: Joi.string().trim().required(),
    bodyType: Joi.string().valid('car', 'truck', 'trailer', 'van').required(),
    status: Joi.string().valid('available', 'sold').default('available'),
  }).unknown(true),
};

export const carPatchSchema = {
  body: {
    state: Joi.string().valid('new', 'used'),
    price: Joi.number(),
    manufacturer: Joi.string().trim(),
    model: Joi.string().trim(),
    bodyType: Joi.string().valid('car', 'truck', 'trailer', 'van'),
    status: Joi.string().valid('available', 'sold'),
  },
};

export const orderSchema = {
  body: {
    carId: Joi.string().trim().required(),
    price: Joi.number().required(),
    status: Joi.string().valid('pending', 'accepted', 'rejected').default('pending'),
  },
};

export const orderPatchSchema = {
  body: {
    price: Joi.number(),
    status: Joi.string().valid('pending', 'accepted', 'rejected'),
  },
};

export const flagSchema = {
  body: {
    carId: Joi.string().trim().required(),
    reason: Joi.string().valid('pricing', 'weird demands').required(),
    description: Joi.string().trim().required(),
  },
};
