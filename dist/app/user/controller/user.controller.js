"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const user_service_1 = require("../service/user.service");
const validate_1 = require("../../../common/validation/validate");
const user_dto_1 = require("../dto/user.dto");
class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    getUserInfo = async (req, res, next) => {
        //     stripe user info from cookie using authenticate middleware
        //     call userService.getUserInfo with user id from token
        //     return response with user info or catch business logic errors
        try {
            const user = await this.userService.getUserInfo(req.user?.userId);
            res.status(200).json({
                user
            });
        }
        catch (err) {
            next(err);
        }
    };
    editUserInfo = async (req, res, next) => {
        try {
            //     validate input data using validateBody and patchUserDto
            //     stripe user info from cookie using authenticate middleware
            //     call userService.updateUserInfo with user id from token and validated data
            //     return response with updated user info or catch business logic errors
            const validatedData = await (0, validate_1.validateBody)(user_dto_1.patchUserDto, req.body);
            const updatedUser = await this.userService.updateUserInfo(req.user?.userId, req.body);
            res.status(200).json({
                message: "Profile updated",
                user: updatedUser
            });
        }
        catch (err) {
            next(err);
        }
    };
}
exports.UserController = UserController;
exports.userController = new UserController(user_service_1.userService);
