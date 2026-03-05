"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.raw(`
    CREATE TABLE permissions (
        id SERIAL PRIMARY KEY,
        resource TEXT NOT NULL,
        action TEXT NOT NULL,
        CONSTRAINT uk_permissions UNIQUE (resource, action)
    );
    CREATE INDEX idx_permissions_resource ON permissions(resource);
    `);
}
async function down(knex) {
    await knex.raw(`DROP TABLE IF EXISTS permissions;`);
}
