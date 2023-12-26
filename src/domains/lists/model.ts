import { Model } from 'objection';
import User from '../users/model';
import Category from '../categories/model';
import Task from '../tasks/model';

class List extends Model {
  static get tableName() {
    return 'lists';
  }

  static get idColumn() {
    return 'id';
  }

  id!: number;

  category_id!: number;

  name!: string;

  status!: boolean;

  created_at!: Date;
  updated_at?: Date;
  deleted_at?: Date;

  static get relationMappings() {
    return {
      user: {
        relation: List.HasOneRelation,
        modelClass: User,
        join: {
          from: 'lists.user_id',
          to: 'user.id'
        }
      },
      category: {
        relation: List.HasOneRelation,
        modelClass: Category,
        join: {
          from: 'categories.id',
          to: 'lists.category_id'
        }
      },
      tasks: {
        relation: List.HasManyRelation,
        modelClass: Task,
        join: {
          from: 'lists.id',
          to: 'tasks.list_id'
        }
      }
    };
  }
}

export default List;