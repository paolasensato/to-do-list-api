import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const USER_TYPES = [
    'ADMINISTRATOR',
    'USER',
  ];
  await knex.schema.createTable('users', table => {
    table.bigIncrements('id')
      .primary();

    table.string('name', 200)
      .notNullable();

    table.string('email', 256)
      .unique()
      .notNullable();

    table.string('password', 100)
      .notNullable();

    table.enum('user_type', USER_TYPES)
      .defaultTo(USER_TYPES[1])
      .notNullable();

    table.boolean('status')
      .defaultTo(true);

    table.timestamps(true, false);
    table.dateTime('deleted_at')
      .index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}