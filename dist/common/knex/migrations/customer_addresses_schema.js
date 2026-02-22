export async function up(knex) {
    await knex.schema.createTable('customer_addresses', (table) => {
        table.bigIncrements('id').primary();
        table.bigInteger('user_id').notNullable();
        table.string('label').notNullable(); // e.g., "Home", "Work"
        table.decimal('lat').notNullable();
        table.decimal('lng').notNullable();
        table.text('text').notNullable(); // Full address text
        table.boolean('is_default').notNullable().defaultTo(false);
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        // Foreign key
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        // Indexes
        // table.index('user_id');
        // table.index(['lat', 'lng']);
        // table.index('is_default');
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('customer_addresses');
}
