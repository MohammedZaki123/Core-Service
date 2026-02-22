export async function up(knex) {
    await knex.schema.createTable('restaurant_members', (table) => {
        table.bigIncrements('id').primary();
        table.bigInteger('user_id').notNullable();
        table.bigInteger('restaurant_id').notNullable();
        table.enu('status', ['active', 'suspended', 'inactive']).notNullable().defaultTo('active');
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.bigInteger('role_permissions_id').notNullable();
        // Foreign keys
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.foreign('restaurant_id').references('id').inTable('restaurants').onDelete('CASCADE');
        table.foreign('role_permissions_id').references('id').inTable('role_permissions').onDelete('RESTRICT');
        // Unique constraint - user can only have one role per restaurant
        table.unique(['user_id', 'restaurant_id']);
        // Indexes
        // table.index('user_id');
        // table.index('restaurant_id');
        // table.index('status');
        // table.index('role_permissions_id');
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('restaurant_members');
}
