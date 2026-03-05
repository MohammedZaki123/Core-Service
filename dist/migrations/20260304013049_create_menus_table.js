"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.raw(`
    CREATE TABLE menus (
        id SERIAL PRIMARY KEY,
        restaurant_id BIGINT NOT NULL,
        category_name TEXT NOT NULL,
        CONSTRAINT fk_menus_restaurant_id FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    );
    CREATE INDEX idx_menus_restaurant_id ON menus(restaurant_id);
    `);
}
async function down(knex) {
    await knex.raw(`DROP TABLE IF EXISTS menus;`);
}
