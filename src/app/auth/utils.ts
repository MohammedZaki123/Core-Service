import bcrypt from "bcrypt";
import {env} from "../../common/config/env";
import jwt , {SignOptions} from "jsonwebtoken";

export type JwtPayload = {
    userId: number;
    email: string;
    role: string;
}
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}


// for login
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    const bcrypt = await import("bcrypt");
    return bcrypt.compare(password, hash);
}

export function createAccessToken(payload: JwtPayload): string {
    const options: SignOptions = {
        expiresIn: Number(env.jwt.accessExpiresIn),
    };
    return jwt.sign(payload, env.jwt.accessSecret, options);
}

export function createRefreshToken(payload: JwtPayload): string {
    const options: SignOptions = {
        expiresIn: Number(env.jwt.refreshExpiresIn),
    };
    return jwt.sign(payload, env.jwt.refreshSecret, options);
}
