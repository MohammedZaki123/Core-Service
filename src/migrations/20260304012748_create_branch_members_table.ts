import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.raw(`
    CREATE TABLE branch_members (
        id SERIAL PRIMARY KEY,
        member_id BIGINT NOT NULL,
        branch_id BIGINT NOT NULL,
--         role_permissions_id BIGINT NOT NULL,
        CONSTRAINT fk_branch_members_member_id FOREIGN KEY (member_id) REFERENCES restaurant_members(id),
        CONSTRAINT fk_branch_members_branch_id FOREIGN KEY (branch_id) REFERENCES restaurant_branches(id),
--         CONSTRAINT fk_branch_members_role_permissions_id FOREIGN KEY (role_permissions_id) REFERENCES role_permissions(id)
       CONSTRAINT uk_product_branches UNIQUE (member_id, branch_id)

    );
    CREATE INDEX idx_branch_members_member_id ON branch_members(member_id);
    CREATE INDEX idx_branch_members_branch_id ON branch_members(branch_id);
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TABLE IF EXISTS branch_members;`)
}

