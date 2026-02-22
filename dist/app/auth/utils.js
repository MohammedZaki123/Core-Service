"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.createAccessToken = createAccessToken;
exports.createRefreshToken = createRefreshToken;
const bcrypt_1 = __importDefault(require("bcrypt"));
const env_1 = require("../../common/config/env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
async function hashPassword(password) {
    return bcrypt_1.default.hash(password, 10);
}
// for login
async function comparePassword(password, hash) {
    const bcrypt = await import("bcrypt");
    return bcrypt.compare(password, hash);
}
function createAccessToken(payload) {
    const options = {
        expiresIn: Number(env_1.env.jwt.accessExpiresIn),
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwt.accessSecret, options);
}
function createRefreshToken(payload) {
    const options = {
        expiresIn: Number(env_1.env.jwt.refreshExpiresIn),
    };
    return jsonwebtoken_1.default.sign(payload, env_1.env.jwt.refreshSecret, options);
}
