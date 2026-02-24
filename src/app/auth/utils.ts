import bcrypt from "bcrypt";
import {env} from "../../common/config/env";
import jwt, {SignOptions} from "jsonwebtoken";
import crypto from "crypto";

export type JwtPayload = {
    userId: number;
    email: string;
    role: string;
}
export  function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}


// for login
export async function comparePassword(password: string, hash: string): Promise<boolean> {
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

export function generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
}

export function hashOTP(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
}

export function compareOTP(otp: string, hash: string): boolean {
    const otpHash = hashOTP(otp);
    return otpHash === hash;
}