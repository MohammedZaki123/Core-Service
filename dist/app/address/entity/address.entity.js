"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
class Address {
    id;
    userId;
    label;
    country;
    city;
    street;
    building;
    apartmentNumber;
    // building and apartment number are optional to accommodate public places that may not have these details
    type;
    lat;
    lng;
    isDefault;
    createdAt;
    constructor(data) {
        this.id = data.id;
        this.userId = data.userId;
        this.label = data.label;
        this.country = data.country;
        this.city = data.city;
        this.street = data.street;
        this.building = data.building;
        this.apartmentNumber = data.apartmentNumber;
        this.type = data.type;
        this.lat = data.lat;
        this.lng = data.lng;
        this.isDefault = data.isDefault;
        this.createdAt = data.createdAt || new Date();
    }
}
exports.Address = Address;
