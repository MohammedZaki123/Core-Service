"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editCustomerAddressesDTO = exports.addCustomerAddressDto = exports.IsValidLongitude = exports.IsValidLatitude = exports.IsRequiredIfLocationFieldExists = void 0;
const class_validator_1 = require("class-validator");
const enums_1 = require("../enums");
/**
 * Custom validator that ensures lat and lng are required if any location-related field is provided
 */
let IsRequiredIfLocationFieldExists = class IsRequiredIfLocationFieldExists {
    validate(value, args) {
        const dto = args.object;
        // Check if any location-related field exists
        const hasLocationField = dto.country !== undefined ||
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
    defaultMessage(args) {
        return `${args.property} is required when updating location-related fields (country, city, street, building, apartmentNumber)`;
    }
};
exports.IsRequiredIfLocationFieldExists = IsRequiredIfLocationFieldExists;
exports.IsRequiredIfLocationFieldExists = IsRequiredIfLocationFieldExists = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isRequiredIfLocationFieldExists', async: false })
], IsRequiredIfLocationFieldExists);
/**
 * Custom validator for latitude: must be a decimal string with up to 7 decimal places and within -90 to 90
 */
let IsValidLatitude = class IsValidLatitude {
    validate(value) {
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
};
exports.IsValidLatitude = IsValidLatitude;
exports.IsValidLatitude = IsValidLatitude = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isValidLatitude', async: false })
], IsValidLatitude);
/**
 * Custom validator for longitude: must be a decimal string with up to 7 decimal places and within -180 to 180
 */
let IsValidLongitude = class IsValidLongitude {
    validate(value) {
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
};
exports.IsValidLongitude = IsValidLongitude;
exports.IsValidLongitude = IsValidLongitude = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isValidLongitude', async: false })
], IsValidLongitude);
class addCustomerAddressDto {
    label;
    country;
    city;
    street;
    building;
    apartmentNumber;
    type;
    lat;
    lng;
    isDefault;
}
exports.addCustomerAddressDto = addCustomerAddressDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], addCustomerAddressDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], addCustomerAddressDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], addCustomerAddressDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], addCustomerAddressDto.prototype, "street", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], addCustomerAddressDto.prototype, "building", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], addCustomerAddressDto.prototype, "apartmentNumber", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enums_1.AddressType),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], addCustomerAddressDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.Validate)(IsValidLatitude),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], addCustomerAddressDto.prototype, "lat", void 0);
__decorate([
    (0, class_validator_1.Validate)(IsValidLongitude),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], addCustomerAddressDto.prototype, "lng", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], addCustomerAddressDto.prototype, "isDefault", void 0);
class editCustomerAddressesDTO {
    label;
    country;
    city;
    street;
    building;
    apartmentNumber;
    type;
    lat;
    lng;
    isDefault;
}
exports.editCustomerAddressesDTO = editCustomerAddressesDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], editCustomerAddressesDTO.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], editCustomerAddressesDTO.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], editCustomerAddressesDTO.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], editCustomerAddressesDTO.prototype, "street", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], editCustomerAddressesDTO.prototype, "building", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], editCustomerAddressesDTO.prototype, "apartmentNumber", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(enums_1.AddressType),
    __metadata("design:type", String)
], editCustomerAddressesDTO.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.Validate)(IsRequiredIfLocationFieldExists),
    (0, class_validator_1.Validate)(IsValidLatitude),
    __metadata("design:type", Object)
], editCustomerAddressesDTO.prototype, "lat", void 0);
__decorate([
    (0, class_validator_1.Validate)(IsRequiredIfLocationFieldExists),
    (0, class_validator_1.Validate)(IsValidLongitude),
    __metadata("design:type", Object)
], editCustomerAddressesDTO.prototype, "lng", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], editCustomerAddressesDTO.prototype, "isDefault", void 0);
