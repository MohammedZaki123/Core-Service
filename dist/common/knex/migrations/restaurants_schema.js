export async function up(knex) {
    await knex.schema.createTable('restaurants', (table) => {
        table.bigIncrements('id').primary();
        table.string('name', 200).notNullable();
        table.enu('status', ['active', 'inactive', 'suspended']).notNullable().defaultTo('active');
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.text('logo_url').nullable();
        table.string('primary_country').notNullable(); // e.g., "US", "UK"
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        // Indexes
        // table.index('name');
        // table.index('status');
        // table.index('primary_country');
    });
    // Add updated_at trigger
    await knex.raw(`
    CREATE TRIGGER update_restaurants_updated_at
    BEFORE UPDATE ON restaurants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}
export async function down(knex) {
    await knex.raw('DROP TRIGGER IF EXISTS update_restaurants_updated_at ON restaurants');
    await knex.schema.dropTableIfExists('restaurants');
}
