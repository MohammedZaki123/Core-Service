"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressRouter = void 0;
const express_1 = require("express");
const address_controller_1 = require("./controller/address.controller");
const guard_1 = require("../../common/auth/guard");
exports.addressRouter = (0, express_1.Router)();
exports.addressRouter.get("/addresses", guard_1.authenticate, address_controller_1.customerAddressesController.getCustomerAddresses);
exports.addressRouter.post("/addresses", guard_1.authenticate, address_controller_1.customerAddressesController.addCustomerAddress);
// if the following attributes changes the lat and lng must also exist in input to be updated:
// label, country, city, street, building, apartmentNumber
exports.addressRouter.patch("/addresses/:id", guard_1.authenticate, address_controller_1.customerAddressesController.editCustomerAddress);
exports.addressRouter.delete("/addresses/:id", guard_1.authenticate, address_controller_1.customerAddressesController.deleteCustomerAddress);
