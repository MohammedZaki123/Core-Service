import {createUser, findUserExistsByEmailOrPhone, getUserByEmail} from "../../user/repository/user.repository";
import {createPasswordResetRequest, consumePasswordResetRequest, getLatestPasswordResetRequestByEmail} from "../repository/password-reset.repo";
import {forgetPasswordDto, LoginDto, RegisterDto} from "../dto/auth.dto";
import {CannotSignupAsSystemAdmin, InvalidEmailOrPasswordError, UserAlreadyExistsError} from "../errors";
import {
    hashPassword,
    createAccessToken,
    JwtPayload,
    createRefreshToken,
    comparePassword,
    generateOTP,
    hashOTP
} from "../utils";
import {SystemRole} from "../../user/enums";

export class AuthService {
    register = async (data: RegisterDto) => {
        //     0. if role is system admin throw error
        if (data.role === SystemRole.SYSTEM_ADMIN) {
            throw CannotSignupAsSystemAdmin;
        }
        //     1. check if user exists by email
        //     2. if exists throw error
        if (await findUserExistsByEmailOrPhone(data.email, data.phone)) {
            throw UserAlreadyExistsError;
        }
        //     3. hash password
        const hashedPassword = await hashPassword(data.password);
        //     4. create user
        const user = await createUser({
            email: data.email,
            phone: data.phone,
            name: data.name,
            passwordHash: hashedPassword,
            systemRole: data.role,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const payload: JwtPayload = {
            userId: user.id,
            email: user.email,
            role: user.systemRole,
        }
        //     5. create refresh token and access token
        const accessToken = createAccessToken(payload);
        const refreshToken = createRefreshToken(payload);
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
        }
    }

    login = async (data: LoginDto) => {
        //     Use getUserByEmail to find user by email
        const user = await getUserByEmail(data.email);
        //     if user not found throw error "Invalid email or password"
        if (!user) {
            throw InvalidEmailOrPasswordError;
        }
        //     compare input password with stored password hash
        const areEqual = await comparePassword(data.password, user.passwordHash)
        //     if password does not match throw error "Invalid email or password"
        if (!areEqual) {
            throw InvalidEmailOrPasswordError;
        }
        const payload: JwtPayload = {
            userId: user.id,
            email: user.email,
            role: user.systemRole,
        }
        //     create access token and refresh token
        const accessToken = createAccessToken(payload);
        const refreshToken = createRefreshToken(payload);
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
        }
    }

    forgetPassword = async (data: forgetPasswordDto) => {
    // 1. check if user exists by email
    // 2. if not exists throw an error
    // 3. generate a 6 digit OTP
    // 4. hash the OTP
    // 5. Create password reset request and added to the database with expiry time and id
        // from output of user table
    // 6. Send OTP to user email
        const user = await getUserByEmail(data.email);
        if(!user) {
            return;
        }
        const otp = generateOTP();
        const hashedOTP =  hashOTP(otp);
        await createPasswordResetRequest({
            userId: user.id,
            otpHash: hashedOTP,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // expires in 15 minutes
            createdAt: new Date(),
        });
        // TODO: send OTP to user email
        console.log(`mocked email sent ${otp}`);
    }

    resetPassword = async (otp: string, newPassword: string) => {

    }
}

export const authService = new AuthService();