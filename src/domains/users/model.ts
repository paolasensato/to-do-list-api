import { Model, ModelOptions, Pojo, QueryContext } from 'objection';
import bcrypt from 'bcryptjs';
import omit from 'lodash/omit';

export const BCRYPT_LENGTH = 12;

class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get idColumn() {
    return 'id';
  }

  id!: number;

  name!: string;

  email!: string;

  password!: string;

  user_type!: string;

  status!: boolean;

  created_at!: Date;
  updated_at?: Date;
  deleted_at?: Date;

  $beforeInsert(queryContext: QueryContext): Promise<any> | void {
    super.$beforeInsert(queryContext);
    this.password = bcrypt.hashSync(this.password, BCRYPT_LENGTH);
  }

  $beforeUpdate(options: ModelOptions & { old: User }, queryContext: QueryContext): Promise<any> | void {
    super.$beforeUpdate(options, queryContext);
    this.updated_at = new Date();

    if (this.password) {
      this.password = bcrypt.hashSync(this.password, BCRYPT_LENGTH);
    }
  }

  get $hiddenFields(): string[] {
    return ['password'];
  }

  $formatJson(json: Pojo) {
    const jsonFormatted = super.$formatJson(json);
    if (this.$hiddenFields.length) {
      return omit(jsonFormatted, this.$hiddenFields);
    }
    return jsonFormatted;
  }
}

export default User;