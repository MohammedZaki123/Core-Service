"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.raw(`
     INSERT INTO role_permissions (role, permission_id) VALUES
    -- Owner: All permissions (15 total)
    ('owner', 1), ('owner', 2), ('owner', 3), ('owner', 4), ('owner', 5),
    ('owner', 6), ('owner', 7), ('owner', 8), ('owner', 9), ('owner', 10),
    ('owner', 11), ('owner', 12), ('owner', 13), ('owner', 17), ('owner', 18),
    ('owner', 19), ('owner', 20), ('owner', 21), ('owner', 22), ('owner', 23), ('owner', 24)
    ,('owner', 25), ('owner', 26)
    
    -- Manager: Menu + Orders (8 total)
    ('manager', 9), ('manager', 10),
    ('manager', 11), ('manager', 12), ('manager', 13), ('manager', 14),
    ('manager', 15), ('manager', 16), ('manager', 27)
    
    -- Staff: Basic orders only (2 total)
    ('staff', 13), ('staff', 14)
    
    ON CONFLICT (role, permission_id) DO NOTHING;`);
}
async function down(knex) {
    await knex.raw(`TRUNCATE TABLE role_permissions CASCADE;`);
}
