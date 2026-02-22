"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const user_repository_1 = require("../../user/repository/user.repository");
const errors_1 = require("../errors");
const utils_1 = require("../utils");
const enums_1 = require("../../user/enums");
class AuthService {
    register = async (data) => {
        //     0. if role is system admin throw error
        if (data.role === enums_1.SystemRole.SYSTEM_ADMIN) {
            throw errors_1.CannotSignupAsSystemAdmin;
        }
        //     1. check if user exists by email
        //     2. if exists throw error
        if (await (0, user_repository_1.findUserExistsByEmailOrPhone)(data.email, data.phone)) {
            throw errors_1.UserAlreadyExistsError;
        }
        //     3. hash password
        const hashedPassword = await (0, utils_1.hashPassword)(data.password);
        //     4. create user
        const user = await (0, user_repository_1.createUser)({
            email: data.email,
            phone: data.phone,
            passwordHash: hashedPassword,
            systemRole: data.role,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.systemRole,
        };
        //     5. create refresh token and access token
        const accessToken = (0, utils_1.createAccessToken)(payload);
        const refreshToken = (0, utils_1.createRefreshToken)(payload);
        //     6. return user and refresh token and access token
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                systemRole: user.systemRole,
                createdAt: user.createdAt
            }
        };
    };
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
