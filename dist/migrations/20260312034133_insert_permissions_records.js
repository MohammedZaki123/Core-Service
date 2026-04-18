"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.raw(`
    INSERT INTO permissions (resource, action) VALUES
    -- Restaurant permissions
    (1,'restaurant', 'read'),
    (2,'restaurant', 'update'),
    
    -- Branch Management permissions
    (3,'branch', 'read'),
    (4,'branch', 'update'),
    
    -- Member management permissions
    (5,'members', 'read'),
    (6,'members', 'create'),
    (7,'members', 'update'),
    (8,'members', 'delete'),

    -- Menu permissions
    (9,'menu', 'read'),
    (10,'menu', 'create'),
    (11,'menu', 'update'),
    (12,'menu', 'delete'),
    
    -- Order permissions
    (13,'order', 'read'),
    (14,'order', 'update'),
    (15,'order', 'accept'),
    (16,'order', 'reject'),
    
    -- Restaurant Balance
    (17, 'balance', 'read')
    
    -- Product Branch Details
    (18, 'product_branches_details', 'read'),
    (19, 'product_branches_details', 'create'),
    (20, 'product_branches_details', 'update'),
    (21, 'product_branches_details', 'delete')
        
    -- Payout
    (22, 'payout', 'read')                                           
    
    -- Product Management
    (23, 'product', 'read'),
    (24, 'product', 'create'),
    (25, 'product', 'update'),
    (26, 'product', 'delete'),
                                               
    -- Analytics permissions (1)
    (27, 'analytics', 'read')
    ON CONFLICT (resource, action) DO NOTHING;
    
    `);
}
async function down(knex) {
    await knex.raw(`TRUNCATE TABLE permissions CASCADE;`);
}
