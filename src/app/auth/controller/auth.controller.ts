import {AuthService, authService} from '../service/auth.service';
import {forgetPasswordDto, LoginDto, RegisterDto} from '../dto/auth.dto';
import {NextFunction, Request, Response} from "express";
import {validateBody} from "../../../common/validation/validate";

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
            res.status(200).json(result);
        }catch(err){
            next(err);
        }
    }

    forgetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        // validate input data using validateBody and ForgetPasswordDto
        // call authService.forgetPassword with validated data
        // return response with success message

        try{
            const validatedData = await validateBody(forgetPasswordDto, req.body);
            await this.authService.forgetPassword(validatedData);
            res.status(200).json({
                message: "If an account with the provided email exists, a password reset OTP has been sent."
            });
        }catch(err){
            next(err);
        }
    }
}
export const authController = new AuthController(authService);