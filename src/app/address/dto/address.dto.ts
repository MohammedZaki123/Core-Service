import {IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, Validate} from "class-validator";
import {AddressType} from "../enums";

/**
 * Custom validator that ensures lat and lng are required if any location-related field is provided
 */
@ValidatorConstraint({ name: 'isRequiredIfLocationFieldExists', async: false })
export class IsRequiredIfLocationFieldExists implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const dto = args.object as editCustomerAddressesDTO;

        // Check if any location-related field exists
        const hasLocationField =
            dto.country !== undefined ||
            dto.city !== undefined ||
            dto.street !== undefined ||
            dto.building !== undefined ||
            dto.apartmentNumber !== undefined;

        // If location field exists, this field (lat or lng) is required
        if (hasLocationField) {
            return value !== undefined && value !== null;
        }

        // Otherwise, it's optional
        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} is required when updating location-related fields (country, city, street, building, apartmentNumber)`;
    }
}

/**
 * Custom validator for latitude: must be a decimal string with up to 7 decimal places and within -90 to 90
 */
@ValidatorConstraint({ name: 'isValidLatitude', async: false })
export class IsValidLatitude implements ValidatorConstraintInterface {
    validate(value: any) {
        if (value === undefined || value === null) {
            return true; // Let @IsOptional handle this
        }

        // Convert to string if it's a number
        const stringValue = String(value);

        // Check if it's a valid decimal format
        const decimalRegex = /^-?\d{1,2}(\.\d{1,7})?$/;
        if (!decimalRegex.test(stringValue)) {
            return false;
        }

        // Check if value is within -90 to 90
        const numValue = parseFloat(stringValue);
        return !isNaN(numValue) && numValue >= -90 && numValue <= 90;
    }

    defaultMessage() {
        return 'latitude must be a decimal number between -90 and 90 with up to 7 decimal places';
    }
}

/**
 * Custom validator for longitude: must be a decimal string with up to 7 decimal places and within -180 to 180
 */
@ValidatorConstraint({ name: 'isValidLongitude', async: false })
export class IsValidLongitude implements ValidatorConstraintInterface {
    validate(value: any) {
        if (value === undefined || value === null) {
            return true; // Let @IsOptional handle this
        }

        // Convert to string if it's a number
        const stringValue = String(value);

        // Check if it's a valid decimal format
        const decimalRegex = /^-?\d{1,3}(\.\d{1,7})?$/;
        if (!decimalRegex.test(stringValue)) {
            return false;
        }

        // Check if value is within -180 to 180
        const numValue = parseFloat(stringValue);
        return !isNaN(numValue) && numValue >= -180 && numValue <= 180;
    }

    defaultMessage() {
        return 'longitude must be a decimal number between -180 and 180 with up to 7 decimal places';
    }
}

export class addCustomerAddressDto {

    @IsString()
    @IsNotEmpty()
    label!: string;

    @IsString()
    @IsNotEmpty()
    country!: string

    @IsString()
    @IsNotEmpty()
    city!: string;

    @IsString()
    @IsNotEmpty()
    street!: string

    @IsOptional()
    @IsString()
    building?: string;

    @IsOptional()
    @IsString()
    apartmentNumber?: string

    @IsEnum(AddressType)
    @IsNotEmpty()
    type!: AddressType;

    @Validate(IsValidLatitude)
    @IsNotEmpty()
    lat!: string | number;

    @Validate(IsValidLongitude)
    @IsNotEmpty()
    lng!: string | number;

    @IsBoolean()
    @IsNotEmpty()
    isDefault!: boolean;
}

export class editCustomerAddressesDTO {

    @IsString()
    label?: string;

    @IsString()
    country?: string;

    @IsString()
    city?: string;

    @IsString()
    street?: string;

    @IsOptional()
    @IsString()
    building?: string;

    @IsOptional()
    @IsString()
    apartmentNumber?: string;

    @IsEnum(AddressType)
    type?: AddressType;

    @Validate(IsRequiredIfLocationFieldExists)
    @Validate(IsValidLatitude)
    lat?: string | number;

    @Validate(IsRequiredIfLocationFieldExists)
    @Validate(IsValidLongitude)
    lng?: string | number;

    @IsBoolean()
    isDefault?: boolean;
}

