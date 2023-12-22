import { NextFunction, Request, Response } from 'express';
import { createTaskSchema } from './validator';
import badRequestError from '../../errors/bad-request';
import Task from './model';
import List from '../lists/model';
import notFoundError from '../../errors/not-found-error';
import tasksErrors from './errors';

async function createTask(request: Request, response: Response, next: NextFunction) {
  try {
    const { user, body } = request;

    const {error} = createTaskSchema.validate(body);

    if (error) badRequestError(response, error.details[0].message);

    const {list_id} = body;

    const listRegistered = await List.query()
      .where('id', list_id)
      .where('user_id', user.id)
      .first();

    if(!listRegistered) return notFoundError(response, tasksErrors.listNotFound);

    const task = await Task.query()
      .insertAndFetch(body);

    response.status(200)
      .json(task);
  } catch (error) {
    next(error);
  }
}

export default {
  createTask
};