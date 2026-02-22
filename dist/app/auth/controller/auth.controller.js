"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("../service/auth.service");
const auth_dto_1 = require("../dto/auth.dto");
const validate_1 = require("../../../common/validation/validate");
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    signUp = async (req, res, next) => {
        // validate input data using validateBody and RegisterDto
        // call authService.register with validated data
        // return respone with user and tokens or catch business logic errors
        try {
            const validatedData = await (0, validate_1.validateBody)(auth_dto_1.RegisterDto, req.body);
            const result = await this.authService.register(validatedData);
            res.status(201).json(result);
        }
        catch (err) {
            next(err);
        }
    };
}
exports.AuthController = AuthController;
exports.authController = new AuthController(auth_service_1.authService);
