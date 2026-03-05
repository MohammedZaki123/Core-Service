"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./controller/user.controller");
const guard_1 = require("../../common/auth/guard");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.get('/me', guard_1.authenticate, user_controller_1.userController.getUserInfo);
exports.userRouter.patch('/me', guard_1.authenticate, user_controller_1.userController.editUserInfo);
