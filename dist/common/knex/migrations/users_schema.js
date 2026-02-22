export async function up(knex) {
    await knex.schema.createTable('users', (table) => {
        table.bigIncrements('id').primary();
        table.string('email').notNullable().unique();
        table.string('phone').notNullable().unique();
        table.string('name').notNullable();
        table.text('password_hash').notNullable();
        table.enu('system_role', ['customer', 'restaurant_owner', 'delivery_agent', 'admin']).notNullable();
        table.enu('status', ['active', 'inactive', 'suspended']).notNullable().defaultTo('active');
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
        // Indexes
        // table.index('email');
        // table.index('phone');
        // table.index('system_role');
        // table.index('status');
    });
}
// Add updated_at trigger
//     await knex.raw(`
//     CREATE OR REPLACE FUNCTION update_updated_at_column()
//     RETURNS TRIGGER AS $$
//     BEGIN
//       NEW.updated_at = NOW();
//       RETURN NEW;
//     END;
//     $$ LANGUAGE plpgsql;
//
//     CREATE TRIGGER update_users_updated_at
//     BEFORE UPDATE ON users
//     FOR EACH ROW
//     EXECUTE FUNCTION update_updated_at_column();
//   `);
// }
export async function down(knex) {
    await knex.raw('DROP TRIGGER IF EXISTS update_users_updated_at ON users');
    await knex.schema.dropTableIfExists('users');
}
