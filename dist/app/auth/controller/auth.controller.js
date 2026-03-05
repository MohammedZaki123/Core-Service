"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("../service/auth.service");
const auth_dto_1 = require("../dto/auth.dto");
const validate_1 = require("../../../common/validation/validate");
const time_convertor_1 = require("../../../common/time/time_convertor");
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    signUp = async (req, res, next) => {
        // validate input data using validateBody and RegisterDto
        // call authService.register with validated data
        // return response with user and tokens or catch business logic errors
        try {
            const validatedData = await (0, validate_1.validateBody)(auth_dto_1.RegisterDto, req.body);
            const result = await this.authService.register(validatedData);
            res.cookie("access_token", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: (0, time_convertor_1.hoursToMilliseconds)(1)
            });
            res.cookie("refresh_token", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: (0, time_convertor_1.weeksToMilliseconds)(1),
                path: '/api/auth/refresh'
            });
            res.status(201).json(result);
        }
        catch (err) {
            next(err);
        }
    };
    login = async (req, res, next) => {
        // validate input data using validateBody and LoginDto
        // call authService.login with validated data
        // return response with user and tokens or catch business logic errors
        try {
            const validatedData = await (0, validate_1.validateBody)(auth_dto_1.LoginDto, req.body);
            const result = await this.authService.login(validatedData);
            res.cookie("access_token", result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 1000
            });
            res.cookie("refresh_token", result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/api/auth/refresh'
            });
            res.status(200).json(result);
        }
        catch (err) {
            next(err);
        }
    };
    forgetPassword = async (req, res, next) => {
        // validate input data using validateBody and ForgetPasswordDto
        // call authService.forgetPassword with validated data
        // return response with success message
        try {
            const validatedData = await (0, validate_1.validateBody)(auth_dto_1.forgetPasswordDto, req.body);
            await this.authService.forgetPassword(validatedData);
            res.status(200).json({
                message: "If an account with the provided email exists, a password reset OTP has been sent."
            });
        }
        catch (err) {
            next(err);
        }
    };
    resetPassword = async (req, res, next) => {
        // validate input data using validateBody and ResetPasswordDto
        // call authService.resetPassword with validated data
        // return response with success message or catch business logic errors
        try {
            const validatedData = await (0, validate_1.validateBody)(auth_dto_1.resetPasswordDto, req.body);
            await this.authService.resetPassword(validatedData);
            res.status(200).json({
                message: "Password reset successfully, please login again"
            });
        }
        catch (err) {
            next(err);
        }
    };
    refreshToken = async (req, res, next) => {
        //   validate input data using validateBody and RefreshTokenDto
        //   call authService.refreshToken with validated data
        //   return response with new access token and catch business logic errors
        try {
            const validatedData = await (0, validate_1.validateBody)(auth_dto_1.refreshDTO, req.body);
            const result = await this.authService.refreshToken(validatedData);
            res.cookie("access_token", result.newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 1000
            });
            res.status(200).json(result);
        }
        catch (err) {
            next(err);
        }
    };
}
exports.AuthController = AuthController;
exports.authController = new AuthController(auth_service_1.authService);
