import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    CREATE TABLE product_branches_details (
        id SERIAL PRIMARY KEY,
        product_id BIGINT NOT NULL,
        branch_id BIGINT NOT NULL,
        stock INT NOT NULL,
        is_available BOOLEAN NOT NULL,
        price INT NOT NULL,
        CONSTRAINT fk_product_branches_product_id FOREIGN KEY (product_id) REFERENCES products(id),
        CONSTRAINT fk_product_branches_branch_id FOREIGN KEY (branch_id) REFERENCES restaurant_branches(id),
        CONSTRAINT uk_product_branches UNIQUE (product_id, branch_id)
    );
    CREATE INDEX idx_product_branches_product_id ON product_branches_details(product_id);
    CREATE INDEX idx_product_branches_branch_id ON product_branches_details(branch_id);
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TABLE IF EXISTS product_branches_details;`)
}

