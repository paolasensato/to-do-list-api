import { Model } from 'objection';
import List from '../lists/model';

class Task extends Model {
  static get tableName() {
    return 'tasks';
  }

  static get idColumn() {
    return 'id';
  }

  id!: number;

  name!: string;

  description!: string;

  end_date!: Date;

  conclusion_date!: Date;

  status!: boolean;

  created_at!: Date;
  updated_at?: Date;
  deleted_at?: Date;

  static get relationMappings() {
    return {
      list: {
        relation: Task.BelongsToOneRelation,
        modelClass: List,
        join: {
          from: 'tasks.list_id',
          to: 'lists.id'
        }
      }
    };
  }
}

export default Task;