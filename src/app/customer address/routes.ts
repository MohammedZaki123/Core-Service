import {Router} from "express";
import {customerAddressesController} from "./controller/address.controller";
import {authenticate} from "../../common/auth/guard";

export const addressRouter = Router();

addressRouter.get('/', authenticate,customerAddressesController.getCustomerAddresses);
addressRouter.post('/', authenticate,customerAddressesController.addCustomerAddress);

// if the following attributes changes the lat and lng must also exist in input to be updated:
// label, country, city, street, building, apartmentNumber
addressRouter.patch('/:id',authenticate, customerAddressesController.editCustomerAddress);
addressRouter.delete('/:id',authenticate, customerAddressesController.deleteCustomerAddress);


