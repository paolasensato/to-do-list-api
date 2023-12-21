import Joi from 'joi';

const listSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .required(),
  user_id: Joi.number()
    .required(),
  category_id: Joi.number(),
});

export {
  listSchema,
};
