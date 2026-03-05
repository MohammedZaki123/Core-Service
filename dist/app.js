"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const routes_js_1 = require("./routes.js");
const correlationID_1 = require("./common/correlationID/correlationID");
const errorHandler_1 = require("./common/error/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
function createApp() {
    const app = (0, express_1.default)();
    app.use(correlationID_1.correlationId);
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use('/api', routes_js_1.routes);
    app.use(errorHandler_1.errorHandler);
    return app;
}
