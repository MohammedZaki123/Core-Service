"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthenticated = void 0;
const AppError_1 = require("../error/AppError");
exports.NotAuthenticated = new AppError_1.AppError('Not authenticated', 401);
