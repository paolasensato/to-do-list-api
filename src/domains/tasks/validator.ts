import Joi from 'joi';

const createTaskSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required(),
  description: Joi.string()
    .trim()
    .max(500)
    .allow(null, ''),
  end_date: Joi.date(),
  list_id: Joi.number()
    .required(),
});

export {
  createTaskSchema
};