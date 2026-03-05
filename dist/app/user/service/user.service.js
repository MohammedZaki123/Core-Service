"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const user_repository_1 = require("../repository/user.repository");
const errors_1 = require("../errors");
class UserService {
    getUserInfo = async (userId) => {
        const user = await (0, user_repository_1.getUserById)(userId);
        if (!user) {
            throw errors_1.UserNotFoundError;
        }
        return {
            id: user.id,
            email: user.email,
            phone: user.phone,
            name: user.name,
            systemRole: user.systemRole,
        };
    };
    updateUserInfo = async (userId, data) => {
        //    user id surely exists because it is extracted from token stored in cookie after login
        const user = await (0, user_repository_1.updateUser)(userId, data);
        return {
            id: user.id,
            email: user.email,
            phone: user.phone,
            name: user.name,
            systemRole: user.systemRole,
        };
    };
}
exports.UserService = UserService;
exports.userService = new UserService();
