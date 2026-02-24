import {SystemRole} from "../../user/enums";
import {IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength} from "class-validator";


export class RegisterDto {
    @IsEmail()
    email!: string;


    @MinLength(10)
    @MaxLength(11)
    phone!: string;


    @IsString()
    @MinLength(1)
    name!: string;

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
    }, {
        message: 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol.',
    })
    password!: string;

    @IsEnum(SystemRole)
    // checks that input role is a member of the SystemRole enum, which includes 'customer', 'restaurant_user', and 'delivery_agent'
    role!: SystemRole
}

export class LoginDto {
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;
}

export class forgetPasswordDto {
    @IsEmail()
    email!: string;
}

export class resetPasswordDto {
    @IsString()
    @IsNotEmpty()
    otp!: string;

    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
    }, {
        message: 'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol.',
    })
    newPassword!: string;
}