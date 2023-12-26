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

async function getTasks (request: Request, response: Response, next: NextFunction) {
  try {
    const {user} = request;

    const tasks = await Task.query()
      .join('lists', 'tasks.list_id', 'lists.id')
      .where('lists.user_id', user.id)
      .where('tasks.status', true)
      .where('tasks.deleted_at', null)
      .where('lists.status', true)
      .where('lists.deleted_at', null)
      .withGraphFetched('list(list)')
      .modifiers({
        list(builder) {
          builder.select([
            'lists.id',
            'lists.user_id',
            'lists.name',
          ]);
        },
      });

    response.status(200)
      .json(tasks);
  } catch (error) {
    next(error);
  }
}

async function getTask(request: Request, response: Response, next: NextFunction) {
  try {
    const { user, params } = request;

    const { task_id: idTask } = params;

    const task = await Task.query()
      .join('lists', 'tasks.list_id', 'lists.id')
      .findById(idTask)
      .where('lists.user_id', user.id)
      .where('tasks.deleted_at', null)
      .where('lists.deleted_at', null)
      .withGraphFetched('list(list)')
      .modifiers({
        list(builder) {
          builder.select([
            'id',
            'name',
            'status',
          ])
            .where('deleted_at', null);
        },
      });

    if (!task) return notFoundError(response);

    response.status(200)
      .json(task);
  } catch (error) {
    next(error);
  }
}

export default {
  createTask,
  getTasks,
  getTask
};