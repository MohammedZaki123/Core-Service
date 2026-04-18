"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDoesNotExist = void 0;
const AppError_1 = require("../../lib/error/AppError");
exports.ProductDoesNotExist = new AppError_1.AppError('Branch Not Found', 404);
