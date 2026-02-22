export async function up(knex) {
    await knex.schema.createTable('product_branches_details', (table) => {
        table.bigIncrements('id').primary();
        table.bigInteger('product_id').notNullable();
        table.bigInteger('branch_id').notNullable();
        table.integer('stock').nullable(); // Inventory quantity (null = unlimited)
        table.boolean('is_available').notNullable().defaultTo(true);
        table.decimal('price', 10, 2).notNullable(); // Price can vary by branch
        // Foreign keys
        table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
        table.foreign('branch_id').references('id').inTable('restaurant_branches').onDelete('CASCADE');
        // Unique constraint - one price/availability per product per branch
        table.unique(['product_id', 'branch_id']);
        // Indexes
        table.index('product_id');
        table.index('branch_id');
        table.index('is_available');
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('product_branches_details');
}
