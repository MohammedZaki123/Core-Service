export async function up(knex) {
    await knex.schema.createTable('branch_members', (table) => {
        table.bigIncrements('id').primary();
        table.bigInteger('member_id').notNullable();
        table.bigInteger('branch_id').notNullable();
        // Foreign keys
        table.foreign('member_id').references('id').inTable('restaurant_members').onDelete('CASCADE');
        table.foreign('branch_id').references('id').inTable('restaurant_branches').onDelete('CASCADE');
        // Unique constraint - member can be assigned to a branch only once
        table.unique(['member_id', 'branch_id']);
        // Indexes
        table.index('member_id');
        table.index('branch_id');
    });
    // Note: If branch_members is empty for a member, they have access to ALL branches
}
export async function down(knex) {
    await knex.schema.dropTableIfExists('branch_members');
}
