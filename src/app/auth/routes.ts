import {authController} from "./controller/auth.controller";
import {Router} from "express";

export const authRouter = Router();

authRouter.post('/register', authController.signUp);