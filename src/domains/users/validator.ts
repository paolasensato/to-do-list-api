import Joi from 'joi';

export enum UserType {
    ADMINISTRATOR = 'ADMINISTRATOR',
    CLIENT = 'CLIENT',
    ARTISAN = 'ARTISAN',
}

const createUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .max(200)
    .required(),
  email: Joi.string()
    .trim()
    .max(200)
    .email({ 
      minDomainSegments: 2,
      tlds: { allow: false }
    })
    .required(),
  password: Joi.string()
    .min(6)
    .max(100)
    .required(),
  user_type: Joi.string()
    .valid(...Object.values(UserType))
    .required(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .max(200)
    .required(),
  password: Joi.string()
    .trim()
    .min(6)
    .max(100)
    .required(),
});


export {
  createUserSchema,
  loginSchema
};
