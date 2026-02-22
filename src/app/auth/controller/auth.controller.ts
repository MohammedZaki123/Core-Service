import {AuthService, authService} from '../service/auth.service';
import {RegisterDto} from '../dto/auth.dto';
import {NextFunction, Request, Response} from "express";
import {validateBody} from "../../../common/validation/validate";

export class AuthController {
    constructor(private readonly authService: AuthService) {
    }
    signUp= async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // validate input data using validateBody and RegisterDto
    // call authService.register with validated data
    // return respone with user and tokens or catch business logic errors
    try{
        const validatedData = await validateBody(RegisterDto, req.body);
        const result = await this.authService.register(validatedData);
        res.status(201).json(result);
    }catch(err){
        next(err);
}
    }

}

export const authController = new AuthController(authService);