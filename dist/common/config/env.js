"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)({ path: path_1.default.resolve(__dirname, '../../../.env') });
const schema = zod_1.z.object({
    PORT: zod_1.z.string().default('3000'),
    DB_HOST: zod_1.z.string().default('localhost'),
    DB_PORT: zod_1.z.string().default('5432'),
    DB_USERNAME: zod_1.z.string().default('postgres'),
    DB_PASSWORD: zod_1.z.string(),
    DB_NAME: zod_1.z.string(),
    DB_POOL_MAX: zod_1.z.string().default('10'),
    DB_MIGRATION_DIRECTORY: zod_1.z.string(),
    DB_MIGRATION_EXTENSION: zod_1.z.string(),
    ACCESS_SECRET: zod_1.z.string(),
    REFRESH_SECRET: zod_1.z.string(),
    ACCESS_EXPIRES_IN: zod_1.z.string(),
    REFRESH_EXPIRES_IN: zod_1.z.string(),
});
const parsed = schema.parse(process.env);
exports.env = {
    port: Number(parsed.PORT),
    db: {
        host: parsed.DB_HOST,
        port: Number(parsed.DB_PORT),
        username: parsed.DB_USERNAME,
        password: parsed.DB_PASSWORD,
        name: parsed.DB_NAME,
        poolMax: Number(parsed.DB_POOL_MAX),
        // C:\Users\Lenovo\IdeaProjects\Quick-Bite\Core-Service\src\migrations
        migrationDirectory: path_1.default.resolve(__dirname, "../../../", parsed.DB_MIGRATION_DIRECTORY),
        migrationExtension: parsed.DB_MIGRATION_EXTENSION,
    },
    jwt: {
        accessSecret: parsed.ACCESS_SECRET,
        refreshSecret: parsed.REFRESH_SECRET,
        accessExpiresIn: parsed.ACCESS_EXPIRES_IN,
        refreshExpiresIn: parsed.REFRESH_EXPIRES_IN,
    }
};
