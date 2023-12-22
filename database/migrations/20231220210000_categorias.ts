import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('categories', table => {
    table.bigIncrements('id')
      .primary();

    table.bigInteger('user_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users');
        
    table.string('category', 200)
      .notNullable();

    table.unique(['user_id', 'category']);

    table.timestamps(true, false);
    table.dateTime('deleted_at')
      .index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('categories');
}