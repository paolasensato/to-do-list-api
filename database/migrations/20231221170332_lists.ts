import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lists', table => {
    table.bigIncrements('id')
      .primary();

    table.bigInteger('user_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('users');

    table.bigInteger('category_id')
      .unsigned()
      .references('id')
      .inTable('categories');
        
    table.string('name', 200);

    table.boolean('status')
      .defaultTo(true);

    table.timestamps(true, false);
    table.dateTime('deleted_at')
      .index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('lists');
}