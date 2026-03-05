import {getUserById, updateUser} from "../repository/user.repository";
import {UserNotFoundError} from "../errors";
import {patchUserDto} from "../dto/user.dto";

export class UserService {
    getUserInfo = async (userId: number) => {
        const user = await getUserById(userId);
        if(!user){
            throw UserNotFoundError;
        }

        return {
            id: user.id,
            email: user.email,
            phone: user.phone,
            name: user.name,
            systemRole: user.systemRole,
        }
    }
    updateUserInfo = async (userId: number, data: patchUserDto) => {
    //    user id surely exists because it is extracted from token stored in cookie after login
        const user = await updateUser(userId, data);

        return {
            id: user.id,
            email: user.email,
            phone: user.phone,
            name: user.name,
            systemRole: user.systemRole,
        }
    }
}
export const userService = new UserService();

