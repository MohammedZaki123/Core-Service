"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_js_1 = require("./app.js");
const env_js_1 = require("./common/config/env.js");
const knex_js_1 = require("./common/knex/knex.js");
const app = (0, app_js_1.createApp)();
const server = http_1.default.createServer(app);
server.listen(env_js_1.env.port, () => {
    console.log(`Server is running on port ${env_js_1.env.port}`);
});
async function shutdown() {
    console.log('Shutting down server...');
    console.log('Database shutting down...');
    await knex_js_1.db.destroy();
    process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
