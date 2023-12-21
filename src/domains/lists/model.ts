import { Model } from 'objection';
import User from '../users/model';
import Category from '../categories/model';

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
          from: 'lists.category_id',
          to: 'categories.id'
        }
      },
    };
  }
}

export default List;