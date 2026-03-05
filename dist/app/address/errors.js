"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidAddressParameter = exports.cannotAccessAddress = exports.AddressDoesNotExist = void 0;
const AppError_1 = require("../../common/error/AppError");
exports.AddressDoesNotExist = new AppError_1.AppError('Address Not Found', 404);
// 403: Giving an info that resource exist but you cannot access it
// 404: giving info that resource does not exist for this user
exports.cannotAccessAddress = new AppError_1.AppError('Not Found', 404);
exports.invalidAddressParameter = new AppError_1.AppError('Innvalid address ID', 400);
