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
