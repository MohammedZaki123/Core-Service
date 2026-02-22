"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordReset = void 0;
class passwordReset {
    id;
    userId;
    otp_hash;
    expiresAt;
    createdAt;
    consumedAt;
    constructor(data) {
        this.id = data.id;
        this.userId = data.userId;
        this.otp_hash = data.otp_hash;
        this.expiresAt = data.expiresAt;
        this.createdAt = data.createdAt;
        this.consumedAt = data.consumedAt || null;
    }
    is_expired() {
        return new Date() > this.expiresAt;
    }
}
exports.passwordReset = passwordReset;
