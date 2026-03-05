import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    CREATE TABLE role_permissions (
        id SERIAL PRIMARY KEY,
        role TEXT NOT NULL,
        permission_id BIGINT NOT NULL,
        CONSTRAINT fk_role_permissions_permission_id FOREIGN KEY (permission_id) REFERENCES permissions(id)
    );
    CREATE INDEX idx_role_permissions_role ON role_permissions(role);
    CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TABLE IF EXISTS role_permissions;`)
}

