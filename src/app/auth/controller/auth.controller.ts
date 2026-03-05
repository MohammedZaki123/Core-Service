import {AuthService, authService} from '../service/auth.service';
import {forgetPasswordDto, LoginDto, refreshDTO, RegisterDto, resetPasswordDto} from '../dto/auth.dto';
import {NextFunction, Request, Response} from "express";
import {validateBody} from "../../../common/validation/validate";
import {hoursToMilliseconds, daysToMilliseconds, weeksToMilliseconds} from "../../../common/time/time_convertor";

export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // validate input data using validateBody and RegisterDto
        // call authService.register with validated data
        // return response with user and tokens or catch business logic errors
        try {
            const validatedData = await validateBody(RegisterDto, req.body);
            const result = await this.authService.register(validatedData);
            res.cookie("access_token", result.accessToken,{
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: hoursToMilliseconds(1)
            })
            res.cookie("refresh_token", result.refreshToken,{
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: weeksToMilliseconds(1),
                path: '/api/auth/refresh'
            })
            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // validate input data using validateBody and LoginDto
        // call authService.login with validated data
        // return response with user and tokens or catch business logic errors

        try {
            const validatedData = await validateBody(LoginDto, req.body);
            const result = await this.authService.login(validatedData);
            res.cookie("access_token", result.accessToken,{
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60*60*1000
            })
            res.cookie("refresh_token", result.refreshToken,{
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 7*24*60*60*1000,
                path: '/api/auth/refresh'
            })
            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }

    forgetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // validate input data using validateBody and ForgetPasswordDto
        // call authService.forgetPassword with validated data
        // return response with success message

        try {
            const validatedData = await validateBody(forgetPasswordDto, req.body);
            await this.authService.forgetPassword(validatedData);
            res.status(200).json({
                message: "If an account with the provided email exists, a password reset OTP has been sent."
            });
        } catch (err) {
            next(err);
        }
    }

    resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // validate input data using validateBody and ResetPasswordDto
        // call authService.resetPassword with validated data
        // return response with success message or catch business logic errors

        try {
            const validatedData = await validateBody(resetPasswordDto, req.body);
            await this.authService.resetPassword(validatedData);
            res.status(200).json({
                message: "Password reset successfully, please login again"
            });
        } catch (err) {
            next(err);
        }
    }
    refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        //   validate input data using validateBody and RefreshTokenDto
        //   call authService.refreshToken with validated data
        //   return response with new access token and catch business logic errors
        try{
            const validatedData = await validateBody(refreshDTO, req.body);
            const result = await this.authService.refreshToken(validatedData);
            res.cookie("access_token", result.newAccessToken,{
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60*60*1000
            })
            res.status(200).json(result);
        }catch(err){
            next(err);
        }
    }
}
export const authController = new AuthController(authService);