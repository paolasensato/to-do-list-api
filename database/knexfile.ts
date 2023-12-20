import type { Knex } from 'knex';
import { format } from 'date-fns-tz';
import dotenv from 'dotenv';
import path from 'path';

interface IKnexConfig {
  [key: string]: Knex.Config;
}

dotenv.config({
  path: path.resolve(__dirname, '../', '.env'),
});

const {
  DB_HOST,
  DB_NAME,
  DB_PORT,
  DB_USER,
  DB_PASS,
} = process.env;

const config: IKnexConfig = {
  development: {
    client: 'mysql2',
    useNullAsDefault: true,
    connection: {
      database: DB_NAME,
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASS,
      timezone: format(new Date(), 'xxx', { timeZone: 'UTC' })
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
      stub: './stub.ts'
    },
    seeds: {
      directory: './seeds',
    },
  },
};

export default config;
