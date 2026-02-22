import {createUser, findUserExistsByEmailOrPhone} from "../../user/repository/user.repository";
import {RegisterDto} from "../dto/auth.dto";
import {CannotSignupAsSystemAdmin, UserAlreadyExistsError} from "../errors";
import {hashPassword, createAccessToken, JwtPayload, createRefreshToken} from "../utils";
import {SystemRole} from "../../user/enums";

export class AuthService{
    register = async (data: RegisterDto) => {
    //     0. if role is system admin throw error
        if(data.role === SystemRole.SYSTEM_ADMIN){
            throw CannotSignupAsSystemAdmin;
        }
    //     1. check if user exists by email
        //     2. if exists throw error
        if(await findUserExistsByEmailOrPhone(data.email, data.phone)){
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
}

export const authService = new AuthService();