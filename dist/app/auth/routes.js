"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const auth_controller_1 = require("./controller/auth.controller");
const express_1 = require("express");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/register', auth_controller_1.authController.signUp);
