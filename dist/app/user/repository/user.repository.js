"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmail = getUserByEmail;
exports.findUserExistsByEmailOrPhone = findUserExistsByEmailOrPhone;
exports.createUser = createUser;
const user_entity_1 = require("../entity/user.entity");
const knex_1 = require("../../../common/knex/knex");
function toEntity(record) {
    return new user_entity_1.User({
        id: record.id,
        email: record.email,
        phone: record.phone,
        passwordHash: record.password_hash,
        systemRole: record.system_role,
        createdAt: record.created_at,
        updatedAt: record.updated_at,
        deletedAt: record.deleted_at,
    });
}
async function getUserByEmail(email) {
    const record = await knex_1.db.select('*').from('users').where('email', email).andWhere('deleted_at', null).first();
    return record ? toEntity(record) : undefined;
}
async function findUserExistsByEmailOrPhone(email, phone) {
    const result = await knex_1.db.raw(`SELECT EXISTS (SELECT 1 FROM users WHERE (email = ? OR phone = ?) AND deleted_at IS NULL) 
    AS "exists"`, [email, phone]);
    return result.rows[0].exists;
}
async function createUser(user) {
    const record = await (0, knex_1.db)("users").insert({
        email: user.email,
        phone: user.phone,
        password_hash: user.passwordHash,
        system_role: user.systemRole,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
    }).returning('*');
    return toEntity(record[0]);
}
