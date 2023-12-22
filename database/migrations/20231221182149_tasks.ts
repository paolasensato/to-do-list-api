import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tasks', table => {
    table.bigIncrements('id')
      .primary();

    table.bigInteger('list_id')
      .notNullable()
      .unsigned()
      .references('id')
      .inTable('lists');
        
    table.string('name', 100)
      .notNullable();

    table.string('description', 500);

    table.date('end_date');

    table.dateTime('conclusion_date');

    table.boolean('status')
      .notNullable()
      .defaultTo(true);

    table.timestamps(true, true);
    table.dateTime('deleted_at')
      .index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tasks');
}