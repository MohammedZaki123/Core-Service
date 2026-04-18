import {Router} from "express";
import {CustomerAddressController} from "./controller/address.controller";
import {authenticate} from "../../lib/auth/guard";
import {container} from "../../lib/di/container";
import {TOKENS} from "../../lib/di/tokens";
import {idempotency} from "../../lib/idempotency/idempotency";

export const addressRouter = Router();

const customerAddressesController = container.resolve<CustomerAddressController>(TOKENS.CustomerAddressController);

addressRouter.get('/', authenticate, customerAddressesController.getCustomerAddresses);
addressRouter.post('/', authenticate, idempotency({strict: false}), customerAddressesController.addCustomerAddress);

// if the following attributes changes the lat and lng must also exist in input to be updated:
// label, country, city, street, building, apartmentNumber
addressRouter.patch('/:id', authenticate, idempotency({strict: false}), customerAddressesController.editCustomerAddress);
addressRouter.delete('/:id', authenticate, customerAddressesController.deleteCustomerAddress);


