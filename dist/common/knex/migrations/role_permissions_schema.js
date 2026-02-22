export async function up(knex) {
    await knex.schema.createTable('role_permissions', (table) => {
        table.bigIncrements('id').primary();
        table.enu('role', ['owner', 'manager', 'staff']).notNullable();
        table.bigInteger('permission_id').notNullable();
        // Foreign key
        table.foreign('permission_id').references('id').inTable('permissions').onDelete('CASCADE');
        // Unique combination
        table.unique(['role', 'permission_id']);
        // Indexes
        table.index('role');
        table.index('permission_id');
    });
    // Seed default role permissions
    // Get permission IDs
    const permissions = await knex('permissions').select('id', 'resource', 'action');
    const getPermissionId = (resource, action) => {
        const perm = permissions.find(p => p.resource === resource && p.action === action);
        return perm?.id;
    };
    // Owner - all permissions
    const ownerPermissions = permissions
        .filter(p => p.action === '*')
        .map(p => ({ role: 'owner', permission_id: p.id }));
    // Manager - menu and orders management
    const managerPermissions = [
        { role: 'manager', permission_id: getPermissionId('menu', 'read') },
        { role: 'manager', permission_id: getPermissionId('menu', 'update') },
        { role: 'manager', permission_id: getPermissionId('orders', 'read') },
        { role: 'manager', permission_id: getPermissionId('orders', 'update') },
        { role: 'manager', permission_id: getPermissionId('orders', 'accept') },
        { role: 'manager', permission_id: getPermissionId('orders', 'reject') },
        { role: 'manager', permission_id: getPermissionId('analytics', 'read') },
    ].filter(p => p.permission_id);
    // Staff - basic order handling
    const staffPermissions = [
        { role: 'staff', permission_id: getPermissionId('orders', 'read') },
        { role: 'staff', permission_id: getPermissionId('orders', 'update') },
    ].filter(p => p.permission_id);
    await knex('role_permissions').insert([
        ...ownerPermissions,
        ...managerPermissions,
        ...staffPermissions,
    ]);
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('role_permissions');
}
