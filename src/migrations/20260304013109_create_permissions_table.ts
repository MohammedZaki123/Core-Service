import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    CREATE TABLE permissions (
        id SERIAL PRIMARY KEY,
        resource TEXT NOT NULL,
        action TEXT NOT NULL,
        CONSTRAINT uk_permissions UNIQUE (resource, action)
    );
    CREATE INDEX idx_permissions_resource ON permissions(resource);
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TABLE IF EXISTS permissions;`)
}

