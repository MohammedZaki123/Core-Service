export async function up(knex) {
    await knex.schema.createTable('permissions', (table) => {
        table.bigIncrements('id').primary();
        table.string('resource').notNullable(); // e.g., "menu", "orders", "members"
        table.string('action').notNullable(); // e.g., "read", "create", "update", "delete", "*"
        // Unique combination of resource and action
        table.unique(['resource', 'action']);
    });
    // Seed default permissions
    await knex('permissions').insert([
        { resource: 'restaurant', action: 'read' },
        { resource: 'restaurant', action: 'update' },
        { resource: 'restaurant', action: '*' },
        { resource: 'members', action: 'read' },
        { resource: 'members', action: 'create' },
        { resource: 'members', action: 'update' },
        { resource: 'members', action: 'delete' },
        { resource: 'members', action: '*' },
        { resource: 'menu', action: 'read' },
        { resource: 'menu', action: 'create' },
        { resource: 'menu', action: 'update' },
        { resource: 'menu', action: 'delete' },
        { resource: 'menu', action: '*' },
        { resource: 'orders', action: 'read' },
        { resource: 'orders', action: 'update' },
        { resource: 'orders', action: 'accept' },
        { resource: 'orders', action: 'reject' },
        { resource: 'orders', action: '*' },
        { resource: 'analytics', action: 'read' },
    ]);
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('permissions');
}
