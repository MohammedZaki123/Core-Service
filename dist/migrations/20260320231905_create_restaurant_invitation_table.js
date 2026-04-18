"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.raw(`
    CREATE TABLE restaurant_invitations (
        id SERIAL PRIMARY KEY,
        restaurant_id BIGINT NOT NULL,
        email BIGINT,
    );ص

`);
}
async function down(knex) {
}
