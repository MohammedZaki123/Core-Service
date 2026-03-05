import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE restaurant_branches (
      id SERIAL PRIMARY KEY,
      restaurant_id BIGINT NOT NULL,
      la DECIMAL(10, 7) NOT NULL,
      lng DECIMAL(10, 7) NOT NULL,
      country_code TEXT NOT NULL,
      label TEXT NOT NULL,
      is_active BOOLEAN NOT NULL,
      opens_at TIME NOT NULL,
      closes_at TIME NOT NULL,
      address_text TEXT NOT NULL,
      accept_orders BOOLEAN NOT NULL,
      created_at TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL,
      currency TEXT NOT NULL CHECK (currency IN ('USD', 'KWD', 'EGP')),
      commission DECIMAL(10, 7) NOT NULL,
      delivery_radius SMALLINT NOT NULL,
      CONSTRAINT fk_restaurant_branches_restaurant_id FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    );
    CREATE INDEX idx_restaurant_branches_restaurant_id ON restaurant_branches(restaurant_id);
    CREATE INDEX idx_restaurant_branches_is_active ON restaurant_branches(is_active);
  `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TABLE IF EXISTS restaurant_branches;`)
}

