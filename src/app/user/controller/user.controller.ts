import {userService, UserService} from "../service/user.service";
import {authenticate} from "../../../common/auth/guard";
import {NextFunction, Request, Response} from "express";
import {validateBody} from "../../../common/validation/validate";
import {refreshDTO} from "../../auth/dto/auth.dto";
import {patchUserDto} from "../dto/user.dto";

export class UserController {
    constructor(private readonly userService: UserService) {

    }

    getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
        //     stripe user info from cookie using authenticate middleware
        //     call userService.getUserInfo with user id from token
        //     return response with user info or catch business logic errors
        try{
            const user = await this.userService.getUserInfo(req.user?.userId!);
            res.status(200).json({
                user
            })
        }catch(err){
            next(err);
        }
    }

    editUserInfo = async (req: Request, res: Response, next: NextFunction) => {
        try{
        //     validate input data using validateBody and patchUserDto
        //     stripe user info from cookie using authenticate middleware
        //     call userService.updateUserInfo with user id from token and validated data
        //     return response with updated user info or catch business logic errors
            const validatedData = await validateBody(patchUserDto, req.body);
            const updatedUser = await this.userService.updateUserInfo(req.user?.userId!, req.body);
            res.status(200).json({
                message: "Profile updated",
                user: updatedUser
            })
        }catch(err){
            next(err);
        }
    }
}

export const userController = new UserController(userService);

