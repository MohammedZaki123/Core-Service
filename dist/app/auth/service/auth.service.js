"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const user_repository_1 = require("../../user/repository/user.repository");
const password_reset_repo_1 = require("../repository/password-reset.repo");
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
            name: data.name,
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
            message: "successfully registered user",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                name: user.name,
                systemRole: user.systemRole,
                createdAt: user.createdAt
            }
        };
    };
    login = async (data) => {
        //     Use getUserByEmail to find user by email
        const user = await (0, user_repository_1.getUserByEmail)(data.email);
        //     if user not found throw error "Invalid email or password"
        if (!user) {
            throw errors_1.InvalidEmailOrPasswordError;
        }
        //     compare input password with stored password hash
        const areEqual = await (0, utils_1.comparePassword)(data.password, user.passwordHash);
        //     if password does not match throw error "Invalid email or password"
        if (!areEqual) {
            throw errors_1.InvalidEmailOrPasswordError;
        }
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.systemRole,
        };
        //     create access token and refresh token
        const accessToken = (0, utils_1.createAccessToken)(payload);
        const refreshToken = (0, utils_1.createRefreshToken)(payload);
        //     return user and tokens
        return {
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                name: user.name,
                systemRole: user.systemRole,
                createdAt: user.createdAt
            }
        };
    };
    forgetPassword = async (data) => {
        // 1. check if user exists by email
        // 2. if not exists throw an error
        // 3. generate a 6 digit OTP
        // 4. hash the OTP
        // 5. Create password reset request and added to the database with expiry time and id
        // from output of user table
        // 6. Send OTP to user email
        const user = await (0, user_repository_1.getUserByEmail)(data.email);
        if (!user) {
            return;
        }
        const otp = (0, utils_1.generateOTP)();
        const hashedOTP = (0, utils_1.hashOTP)(otp);
        await (0, password_reset_repo_1.createPasswordResetRequest)({
            userId: user.id,
            otpHash: hashedOTP,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // expires in 15 minutes
            createdAt: new Date(),
        });
        // TODO: send OTP to user email
        console.log(`mocked email sent ${otp}`);
    };
    resetPassword = async (data) => {
        // 0. Get user record using email from input
        // 1. get latest password reset request for user email
        // 2. if no request found or request is expired throw an error
        // 3. compare input OTP with stored OTP hash
        // 4. if OTP does not match throw an error
        // 5. hash new password
        // 6. update user password with new hash
        // 7. mark the password reset request as consumed
        const user = await (0, user_repository_1.getUserByEmail)(data.email);
        if (!user) {
            return;
        }
        const latestResetRequest = await (0, password_reset_repo_1.getLatestPasswordResetRequestById)(user.id);
        if (!latestResetRequest || latestResetRequest.is_expired()) {
            throw errors_1.resetPasswordFailedError;
        }
        const isOTPValid = (0, utils_1.compareOTP)(data.otp, latestResetRequest.otpHash);
        if (!isOTPValid) {
            throw errors_1.resetPasswordFailedError;
        }
        const hashedPassword = await (0, utils_1.hashPassword)(data.newPassword);
        await (0, user_repository_1.updateUserPassword)(user.id, hashedPassword);
        await (0, password_reset_repo_1.consumePasswordResetRequest)(latestResetRequest.id);
    };
    refreshToken = async (data) => {
        //         verify input refresh token if its expired or invalid throw error
        // if valid create new access token and return
        const payload = (0, utils_1.verifyRefreshToken)(data.refreshToken);
        if (!payload) {
            throw errors_1.invalidTokenError;
        }
        const newAccessToken = (0, utils_1.createAccessToken)(payload);
        return {
            newAccessToken,
        };
    };
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
