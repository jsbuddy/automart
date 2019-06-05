import Joi from '@hapi/joi';

export const userSignupSchema = {
  body: {
    email: Joi.string().lowercase().trim().required(),
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    password: Joi.string().required(),
    address: Joi.string().trim().required(),
    isAdmin: Joi.bool().default(false),
  },
};

export const userSigninSchema = {
  body: {
    email: Joi.string().lowercase().trim().required(),
    password: Joi.string().required(),
  },
};

export const carSchema = {
  body: {
    state: Joi.string().valid('new', 'used').required(),
    price: Joi.number().required(),
    manufacturer: Joi.string().trim().required(),
    model: Joi.string().trim().required(),
    bodyType: Joi.string().valid('car', 'truck', 'trailer', 'van').required(),
    status: Joi.string().valid('available', 'sold').default('available'),
  },
};

export const orderSchema = {
  body: {
    carId: Joi.string().trim().required(),
    price: Joi.number().required(),
    priceOffered: Joi.number().required(),
    status: Joi.string().valid('pending', 'accepted', 'rejected').default('pending'),
  },
};

export const flagSchema = {
  body: {
    carId: Joi.string().trim().required(),
    reason: Joi.string().valid('pricing', 'weird demands').required(),
    description: Joi.string().trim().required(),
  },
};
