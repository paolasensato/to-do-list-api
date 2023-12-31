import { Model } from 'objection';
import User from '../users/model';
import List from '../lists/model';

class Category extends Model {
  static get tableName() {
    return 'categories';
  }

  static get idColumn() {
    return 'id';
  }

  id!: number;

  category!: string;

  status!: boolean;

  created_at!: Date;
  updated_at?: Date;
  deleted_at?: Date;

  static get relationMappings() {
    return {
      user: {
        relation: Category.HasOneRelation,
        modelClass: User,
        join: {
          from: 'categories.user_id',
          to: 'user.id'
        }
      },
      lists: {
        relation: Category.HasManyRelation,
        modelClass: List,
        join: {
          from: 'categories.id',
          to: 'lists.category_id'
        }
      },
    };
  }
}

export default Category;