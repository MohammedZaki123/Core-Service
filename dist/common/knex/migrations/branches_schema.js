export async function up(knex) {
    await knex.schema.createTable('restaurant_branches', (table) => {
        table.bigIncrements('id').primary();
        table.bigInteger('restaurant_id').notNullable();
        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();
        table.string('country_code', 10).notNullable();
        table.string('label', 100).nullable(); // Branch name/label
        table.boolean('is_active').notNullable().defaultTo(true);
        table.time('opens_at').nullable();
        table.time('closes_at').nullable();
        table.text('address_text').notNullable();
        table.boolean('accept_orders').notNullable().defaultTo(true);
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        table.enu('currency', ['USD', 'EUR', 'GBP', 'EGP']).notNullable().defaultTo('USD');
        table.decimal('commission').notNullable(); // Restaurant commission %
        table.smallint('delivery_radius').nullable(); // in kilometers
        // Foreign key
        table.foreign('restaurant_id').references('id').inTable('restaurants').onDelete('CASCADE');
        // Indexes
        table.index('restaurant_id');
        table.index(['latitude', 'longitude']);
        table.index('is_active');
        table.index('country_code');
    });
    // Add updated_at trigger
    await knex.raw(`
    CREATE TRIGGER update_restaurant_branches_updated_at
    BEFORE UPDATE ON restaurant_branches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}
export async function down(knex) {
    await knex.raw('DROP TRIGGER IF EXISTS update_restaurant_branches_updated_at ON restaurant_branches');
    await knex.schema.dropTableIfExists('restaurant_branches');
}
