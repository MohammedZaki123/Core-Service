export async function up(knex) {
    await knex.schema.createTable('products', (table) => {
        table.bigIncrements('id').primary();
        table.string('name', 200).notNullable();
        table.text('description').nullable();
        table.text('image_url').nullable();
        table.bigInteger('restaurant_id').notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        table.bigInteger('menus_id').notNullable(); // Category/menu this product belongs to
        // Foreign keys
        table.foreign('restaurant_id').references('id').inTable('restaurants').onDelete('CASCADE');
        table.foreign('menus_id').references('id').inTable('menus').onDelete('CASCADE');
        // Indexes
        table.index('restaurant_id');
        table.index('menus_id');
        table.index('name');
    });
    // Add updated_at trigger
    await knex.raw(`
    CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}
export async function down(knex) {
    await knex.raw('DROP TRIGGER IF EXISTS update_products_updated_at ON products');
    await knex.schema.dropTableIfExists('products');
}
