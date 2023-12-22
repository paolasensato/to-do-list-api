import Joi from 'joi';
import { createTaskSchema } from '../tasks/validator';

const listSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(200)
    .required(),
  user_id: Joi.number()
    .required(),
  category_id: Joi.number(),
  tasks: Joi.array().items(
    createTaskSchema
  )
});

export {
  listSchema,
};
