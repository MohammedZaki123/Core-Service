"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerAddressesService = exports.CustomerAddressesService = void 0;
const address_repo_js_1 = require("../repository/address.repo.js");
const errors_js_1 = require("../errors.js");
class CustomerAddressesService {
    getCustomerAddresses = async (userId) => {
        //     calling getAddressesByUserId to fetch addresses from the database
        //     return every property of user object except userID and created_at
        const addresses = await (0, address_repo_js_1.getAddressesByUserId)(userId);
        return this.filterAddresses(addresses);
    };
    addCustomerAddress = async (userId, data) => {
        //   calling addCustomerAddress to add new address to the database
        console.log("test_service");
        const address = await (0, address_repo_js_1.createAddress)({
            userId: userId,
            label: data.label,
            country: data.country,
            city: data.city,
            street: data.street,
            building: data.building,
            apartmentNumber: data.apartmentNumber,
            type: data.type,
            lat: Number(data.lat),
            lng: Number(data.lng),
            isDefault: data.isDefault,
            createdAt: new Date()
        });
        return {
            id: address.id,
            label: address.label,
            country: address.country,
            city: address.city,
            street: address.street,
            building: address.building,
            apartmentNumber: address.apartmentNumber,
            type: address.type,
            lat: address.lat,
            lng: address.lng,
            isDefault: address.isDefault
        };
    };
    updateCustomerAddress = async (userId, addressId, data) => {
        // Check if customer is authorized to access address
        const is_exist = await (0, address_repo_js_1.findAddressByCustomerID)(userId, addressId);
        // If not authorized throw a forbidden error
        if (!is_exist) {
            throw errors_js_1.cannotAccessAddress;
        }
        // Call updateAddress function of repository layer
        const updatedAddress = await (0, address_repo_js_1.updateAddress)({
            label: data.label,
            country: data.country,
            city: data.city,
            street: data.street,
            building: data.building,
            apartmentNumber: data.apartmentNumber,
            type: data.type,
            lat: Number(data.lat),
            lng: Number(data.lng),
            isDefault: data.isDefault,
        }, addressId);
        // Return only needed attributes of the returned addresses object
        return {
            id: updatedAddress.id,
            label: updatedAddress.label,
            country: updatedAddress.country,
            city: updatedAddress.city,
            street: updatedAddress.street,
            building: updatedAddress.building,
            apartmentNumber: updatedAddress.apartmentNumber,
            type: updatedAddress.type,
            lat: updatedAddress.lat,
            lng: updatedAddress.lng,
            isDefault: updatedAddress.isDefault
        };
    };
    deleteCustomerAddress = async (userId, addressId) => {
        // Check if customer is authorized to access address
        const is_exist = await (0, address_repo_js_1.findAddressByCustomerID)(userId, addressId);
        // If not authorized throw a forbidden error
        if (!is_exist) {
            throw errors_js_1.cannotAccessAddress;
        }
        // Call delete function of repository layer
        await (0, address_repo_js_1.deleteAddress)(addressId);
    };
    filterAddresses(addresses) {
        const filteredAddresses = [];
        for (let i = 0; i < addresses.length; i++) {
            filteredAddresses.push({
                id: addresses[i].id,
                label: addresses[i].label,
                country: addresses[i].country,
                city: addresses[i].city,
                street: addresses[i].street,
                building: addresses[i].building,
                apartmentNumber: addresses[i].apartmentNumber,
                type: addresses[i].type,
                lat: addresses[i].lat,
                lng: addresses[i].lng,
                isDefault: addresses[i].isDefault
            });
        }
        return filteredAddresses;
    }
}
exports.CustomerAddressesService = CustomerAddressesService;
exports.customerAddressesService = new CustomerAddressesService();
