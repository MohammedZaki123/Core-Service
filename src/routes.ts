import {healthRouter} from "./app/health/health.routes.js";
import {Router} from "express";
import {authRouter} from "./app/auth/routes.js";
import {userRouter} from "./app/user/routes.js";
import {addressRouter} from "./app/address/routes.js";

export const routes = Router();

routes.use("/health",healthRouter);

routes.use("/auth", authRouter);

routes.use("/users", userRouter);

routes.use("/customer", addressRouter)