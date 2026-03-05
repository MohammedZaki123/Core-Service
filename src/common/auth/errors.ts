import {AppError} from "../error/AppError";

export const NotAuthenticated = new AppError('Not authenticated', 401);