export async function up(knex) {
    await knex.schema.createTable('menus', (table) => {
        table.bigIncrements('id').primary();
        table.bigInteger('restaurant_id').notNullable();
        table.string('category_name', 100).notNullable(); // e.g., "Appetizers", "Main Course", "Desserts"
        // Foreign key
        table.foreign('restaurant_id').references('id').inTable('restaurants').onDelete('CASCADE');
        // Indexes
        table.index('restaurant_id');
        table.index('category_name');
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('menus');
}
