import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    CREATE TABLE restaurants (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        status TEXT NOT NULL CHECK (status IN ('active', 'closed')),
        created_at TIMESTAMP NOT NULL,
        logo_url TEXT NOT NULL,
        primary_country TEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL
    );
    CREATE INDEX idx_restaurants_name ON restaurants(name);
    CREATE INDEX idx_restaurants_status ON restaurants(status);
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TABLE IF EXISTS restaurants;`)
}

