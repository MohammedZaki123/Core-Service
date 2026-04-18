import {AppError} from "../../lib/error/AppError";

export const ProductDoesNotExist = new AppError('Branch Not Found', 404);
