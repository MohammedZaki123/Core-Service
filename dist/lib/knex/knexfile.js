"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_js_1 = require("../config/env.js");
const config = {
    client: 'pg',
    connection: {
        host: env_js_1.env.db.host,
        port: env_js_1.env.db.port,
        user: env_js_1.env.db.username,
        password: env_js_1.env.db.password,
        database: env_js_1.env.db.name,
    },
    pool: {
        max: env_js_1.env.db.poolMax,
    },
    migrations: {
        directory: env_js_1.env.db.migrationDirectory,
        extension: env_js_1.env.db.migrationExtension,
    }
};
exports.default = config;
