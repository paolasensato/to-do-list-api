import { NextFunction, Request, Response } from 'express';
import { listSchema } from './validator';
import unprocessableEntity from '../../errors/unprocessable-entity';
import { UniqueViolationError } from 'objection';
import listsErrors from './errors';
import badRequestError from '../../errors/bad-request';
import List from './model';

async function createList(request: Request, response: Response, next: NextFunction) {
  try {
    const {user, body} = request;

    const values = {
      ...body,
      user_id: user.id
    };
  
    const {error} = listSchema.validate(values);

    if (error) badRequestError(response, error.details[0].message);
  
    const list = await List.query().insertAndFetch(values);

    return response.status(200)
      .json(list);
    
  } catch (error: any) {
    if (error instanceof UniqueViolationError) {
      return unprocessableEntity(response, listsErrors.duplicatedList);
    }
    next(error);
  }
}

export default {
  createList,
};
