import { NextFunction, Request, Response } from 'express';
import Category from './model';
import { categorySchema } from './validator';
import unprocessableEntity from '../../errors/unprocessable-entity';
import { UniqueViolationError } from 'objection';
import categoriesErrors from './errors';
import badRequestError from '../../errors/bad-request';
import notFoundError from '../../errors/not-found-error';

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

async function getCategories(request: Request, response: Response, next: NextFunction) {
  try {
    const {user, query} = request;

    const {category} = query;

    const categoriesQuery = Category.query()
      .where('user_id', user.id)
      .where('deleted_at', null)
      .withGraphFetched('lists(lists)')
      .modifiers({
        lists(builder) {
          builder.select([
            'id',
            'name',
            'status',
          ])
            .where('deleted_at', null);
        }
      });

    if (category) {
      categoriesQuery.where('category', 'LIKE', `%${String(category)}%`);
    }

    const categories = await categoriesQuery;

    response.status(200)
      .json(categories);
  } catch (error) {
    next(error);
  }
}

async function getCategory(request: Request, response: Response, next: NextFunction) {
  try {
    const {user, params} = request;

    const {category_id: idCategory} = params;
    
    const category = await Category.query()
      .findById(idCategory)
      .where('user_id', user.id)
      .where('deleted_at', null)
      .withGraphFetched('lists(lists)')
      .modifiers({
        lists(builder) {
          builder.select([
            'id',
            'name',
            'status',
          ])
            .where('deleted_at', null);
        }
      });

    if(!category) return notFoundError(response);

    response.status(200)
      .json(category);
  } catch (error) {
    next(error);
  }
}

export default {
  createCategory,
  getCategories,
  getCategory,
};