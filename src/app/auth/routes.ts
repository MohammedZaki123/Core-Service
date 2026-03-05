import {authController} from "./controller/auth.controller";
import {Router} from "express";

export const authRouter = Router();

authRouter.post('/register', authController.signUp);
authRouter.post('/login', authController.login);
authRouter.post('/forget-password', authController.forgetPassword);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.post('/refresh', authController.refreshToken);