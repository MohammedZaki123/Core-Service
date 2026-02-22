"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CannotSignupAsSystemAdmin = exports.UserAlreadyExistsError = void 0;
const AppError_1 = require("../../common/error/AppError");
exports.UserAlreadyExistsError = new AppError_1.AppError('User Already Exists with same phone or email', 400);
exports.CannotSignupAsSystemAdmin = new AppError_1.AppError('You cannot register as a system admin', 403);
