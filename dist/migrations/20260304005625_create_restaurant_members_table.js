"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.raw(`
    CREATE TABLE restaurant_members (
        id SERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL,
        restaurant_id BIGINT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'suspended')),
        created_at TIMESTAMP NOT NULL,
        role_permissions_id BIGINT NOT NULL,
        CONSTRAINT fk_restaurant_members_user_id FOREIGN KEY (user_id) REFERENCES users(id),
        CONSTRAINT fk_restaurant_members_restaurant_id FOREIGN KEY (restaurant_id) REFERENCES restaurants(id),
        CONSTRAINT fk_restaurant_members_role_permissions_id FOREIGN KEY (role_permissions_id) REFERENCES role_permissions(id)
    );
    CREATE INDEX idx_restaurant_members_user_id ON restaurant_members(user_id);
    CREATE INDEX idx_restaurant_members_restaurant_id ON restaurant_members(restaurant_id);
    CREATE INDEX idx_restaurant_members_status ON restaurant_members(status);
    `);
}
async function down(knex) {
    await knex.raw(`DROP TABLE IF EXISTS restaurant_members;`);
}
