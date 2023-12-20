import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('table_name', table => {
    table.bigIncrements('id')
      .primary();

    table.bigInteger('')
      .notNullable()
      .unsigned()
      .references('')
      .inTable('');
        
    table.string('column_name', 200);

    table.timestamps(true, true);
    table.dateTime('deleted_at')
      .index();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('table_name');
}