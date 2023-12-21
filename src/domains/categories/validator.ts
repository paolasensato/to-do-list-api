import Joi from 'joi';

const categorySchema = Joi.object({
  category: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .required(),
  user_id: Joi.number(),
});

export {
  categorySchema,
};
