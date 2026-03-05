import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    CREATE TABLE menus (
        id SERIAL PRIMARY KEY,
        restaurant_id BIGINT NOT NULL,
        category_name TEXT NOT NULL,
        CONSTRAINT fk_menus_restaurant_id FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    );
    CREATE INDEX idx_menus_restaurant_id ON menus(restaurant_id);
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TABLE IF EXISTS menus;`)
}

