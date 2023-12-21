import { NextFunction, Request, Response } from 'express';
import Category from './model';
import { categorySchema } from './validator';
import unprocessableEntity from '../../errors/unprocessable-entity';
import { UniqueViolationError } from 'objection';
import categoriesErrors from './errors';
import badRequestError from '../../errors/bad-request';

async function createCategory(request: Request, response: Response, next: NextFunction) {
  try {
    const {user, body} = request;

    const values = {
      ...body,
      user_id: user.id
    };
  
    const {error} = categorySchema.validate(values);

    if (error) badRequestError(response, error.details[0].message);
  
    const category = await Category.query().insertAndFetch(values);

    return response.status(200)
      .json(category);
    
  } catch (error: any) {
    if (error instanceof UniqueViolationError) {
      return unprocessableEntity(response, categoriesErrors.duplicatedCategory);
    }
    next(error);
  }
}

export default {
  createCategory
};