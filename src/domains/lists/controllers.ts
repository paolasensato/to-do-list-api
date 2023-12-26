import { NextFunction, Request, Response } from 'express';
import { listSchema, querySchema } from './validator';
import unprocessableEntity from '../../errors/unprocessable-entity';
import { UniqueViolationError } from 'objection';
import listsErrors from './errors';
import badRequestError from '../../errors/bad-request';
import List from './model';
import notFoundError from '../../errors/not-found-error';
import preconditionFailedError from '../../errors/precondition-failed-exception';
import Category from '../categories/model';

async function createList(request: Request, response: Response, next: NextFunction) {
  try {
    const {user, body} = request;

    const values = {
      ...body,
      user_id: user.id
    };
  
    const {error} = listSchema.validate(values);

    if (error) badRequestError(response, error.details[0].message);

    const categoryExist = await Category.query()
      .where('id', values.category_id)
      .where('user_id', user.id)
      .first();

    if (!categoryExist) notFoundError(response);

    if(values.tasks) {
      const listWithTasks = await List.transaction(async transacting => {
        const list = await List.query(transacting)
          .insertGraphAndFetch(values);
      
        return list;
      });
      
      return response.status(200)
        .json(listWithTasks);
      
    }
  
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

async function getLists(request: Request, response: Response, next: NextFunction) {
  try {
    const { user, query } = request;
    const {name, category, task, status} = query;

    const { error } = querySchema.validate(query);

    if (error) return preconditionFailedError(response, error.details[0].message);

    const listQuery = List.query()
      .where('lists.user_id', user.id)
      .where('lists.status', true)
      .where('lists.deleted_at', null)
      .withGraphFetched('[tasks(tasks), category(category)]')
      .modifiers({
        tasks(builder) {
          builder.select([
            'id',
            'name',
            'status',
          ])
            .where('deleted_at', null);
        },
        category(builder) {
          builder.select([
            'id',
            'category',
          ])
            .where('deleted_at', null);
        },
      });

    if(name) {
      listQuery.where('name', 'LIKE', `%${String(name)}%`);
    }

    if(category) {
      listQuery.join('categories', 'categories.id', 'lists.category_id')
        .where('categories.category', 'LIKE', `%${String(category)}%`)
        .where('categories.user_id', user.id);
    }

    if(task) {
      listQuery.join('tasks', 'lists.id', 'tasks.list_id')
        .where('tasks.name', 'LIKE', `%${String(task)}%`);
    }

    if (status) {
      const statusQuery = status === 'false'
        ? false
        : true;

      listQuery.where('status', statusQuery);
    }

    const list = await listQuery;

    response.status(200)
      .json(list);
  } catch (error) {
    next(error);
  }
}

async function getList(request: Request, response:Response, next: NextFunction) {
  try {
    const { user, params } = request;

    const { list_id: idList } = params;

    const lists = await List.query()
      .where('user_id', user.id)
      .findById(idList)
      .withGraphFetched('tasks(tasks)')
      .modifiers({
        tasks(builder) {
          builder.select([
            'id',
            'name',
            'status',
          ])
            .where('deleted_at', null);
        },
      });

    if (!lists) return notFoundError(response);

    response.status(200)
      .json(lists);
  } catch (error) {
    next(error);
  }
}

export default {
  createList,
  getLists,
  getList
};
