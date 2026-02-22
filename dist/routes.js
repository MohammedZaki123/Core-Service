"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const health_routes_js_1 = require("./app/health/health.routes.js");
const express_1 = require("express");
const routes_1 = require("./app/auth/routes");
exports.routes = (0, express_1.Router)();
exports.routes.use("/health", health_routes_js_1.healthRouter);
exports.routes.use("/auth", routes_1.authRouter);
