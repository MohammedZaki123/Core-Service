import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    CREATE TABLE products (
        id SERIAL PRIMARY KEY,
--         Needs futher study
        restaurant_id BIGINT NOT NULL,
        menu_id BIGINT NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL,
        CONSTRAINT fk_products_restaurant_id FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
        CONSTRAINT fk_products_menus_id FOREIGN KEY (menu_id) REFERENCES menus(id)
    );
    CREATE INDEX idx_products_restaurant_id ON products(restaurant_id);
    CREATE INDEX idx_products_menu_id ON products(menu_id);
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TABLE IF EXISTS products;`)
}

