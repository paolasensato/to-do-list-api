import { Model } from 'objection';
import Knex from 'knex';

const {
  DB_HOST,
  DB_NAME,
  DB_PORT,
  DB_USER,
  DB_PASS,
} = process.env;

export const knex = Knex({
  client: 'mysql2',
  debug: true,
  useNullAsDefault: true,
  connection: {
    database: DB_NAME,
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASS,
    decimalNumbers: true,
  }
});

Model.knex(knex);

export default Model;
