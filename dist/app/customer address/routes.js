"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addressRouter = void 0;
const express_1 = require("express");
const guard_1 = require("../../lib/auth/guard");
const container_1 = require("../../lib/di/container");
const tokens_1 = require("../../lib/di/tokens");
const idempotency_1 = require("../../lib/idempotency/idempotency");
exports.addressRouter = (0, express_1.Router)();
const customerAddressesController = container_1.container.resolve(tokens_1.TOKENS.CustomerAddressController);
exports.addressRouter.get('/', guard_1.authenticate, customerAddressesController.getCustomerAddresses);
exports.addressRouter.post('/', guard_1.authenticate, (0, idempotency_1.idempotency)({ strict: false }), customerAddressesController.addCustomerAddress);
// if the following attributes changes the lat and lng must also exist in input to be updated:
// label, country, city, street, building, apartmentNumber
exports.addressRouter.patch('/:id', guard_1.authenticate, (0, idempotency_1.idempotency)({ strict: false }), customerAddressesController.editCustomerAddress);
exports.addressRouter.delete('/:id', guard_1.authenticate, customerAddressesController.deleteCustomerAddress);
