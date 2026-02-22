export async function up(knex) {
    await knex.schema.createTable('password_resets', (table) => {
        table.bigIncrements('id').primary();
        table.bigInteger('user_id').notNullable();
        table.text('otp_hash').notNullable();
        table.timestamp('expires_at').notNullable();
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('consumed_at').nullable();
        // Foreign key
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
        // Indexes
        // table.index('user_id');
        // table.index('expires_at');
        // table.index('consumed_at');
    });
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('password_resets');
}
