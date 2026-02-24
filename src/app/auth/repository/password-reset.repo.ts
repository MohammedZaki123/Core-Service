import {passwordReset} from "../entity/password_reset.entity";
import {db} from "../../../common/knex/knex";

function toEntity(record: any): passwordReset {
    return new passwordReset({
        id: record.id,
        userId: record.user_id,
        otpHash: record.otp_hash,
        expiresAt: record.expires_at,
        createdAt: record.created_at,
        consumedAt: record.consumed_at
    });
}
const PASSWORD_RESET_COLUMNS = [
    "id", "user_id", "otp_hash", "expires_at", "created_at", "consumed_at"
]

export async function createPasswordResetRequest(reset: Partial<passwordReset>): Promise<passwordReset> {
    const record = await db("password_resets").insert( {
        user_id: reset.userId,
        otp_hash: reset.otpHash,
        expires_at: reset.expiresAt,
        created_at: reset.createdAt,
    }).returning(PASSWORD_RESET_COLUMNS);
    return toEntity(record[0]);
}

export async function getLatestPasswordResetRequestByEmail(userId: number): Promise<passwordReset | undefined> {
    const record = await db.select(PASSWORD_RESET_COLUMNS).from('password_resets').where(
        'user_id', userId
    ).andWhere('consumed_at', null).orderBy('created_at', 'desc').first();

    return record? toEntity(record) : undefined;
}

export async function consumePasswordResetRequest(id: number): Promise<void> {
    await db("password_resets").where('id', id).update({
        consumed_at: new Date()
    });
}