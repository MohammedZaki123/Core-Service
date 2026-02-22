import { User } from '../entity/user.entity';
import {db} from "../../../common/knex/knex";

function toEntity(record: any): User {
    return new User({
        id: record.id,
        email: record.email,
        phone: record.phone,
        name: record.name,
        passwordHash: record.password_hash,
        systemRole: record.system_role,
        createdAt: record.created_at,
        updatedAt: record.updated_at,
        deletedAt: record.deleted_at
    });
}
const USER_COLUMNS = [
    "id","email","phone","name","password_hash","system_role","created_at","updated_at","deleted_at"
]

export async function getUserByEmail(email: string): Promise<User | undefined> {
    const record =
        await db.select(USER_COLUMNS).from('users').where(
            'email', email
        ).andWhere('deleted_at', null).first();


    return record? toEntity(record) : undefined;
}
export async function findUserExistsByEmailOrPhone(email: string, phone: string): Promise<Boolean> {
    const result = await db.raw
    (`SELECT EXISTS (SELECT 1 FROM users WHERE (email = ? OR phone = ?) AND deleted_at IS NULL) 
    AS "exists"`, [email, phone]);

    return result.rows[0].exists;
}
export async function createUser(user: Partial<User>): Promise<User> {
    const record = await db("users").insert(
        {
            email: user.email,
            phone: user.phone,
            name: user.name,
            password_hash: user.passwordHash,
            system_role: user.systemRole,
            created_at: user.createdAt,
            updated_at: user.updatedAt,
        }
    ).returning( USER_COLUMNS);
    return toEntity(record[0]);
}