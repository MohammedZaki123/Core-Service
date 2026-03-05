import {Router} from "express";
import {customerAddressesController} from "./controller/address.controller";
import {authenticate} from "../../common/auth/guard";

export const addressRouter = Router();

addressRouter.get("/addresses", authenticate,customerAddressesController.getCustomerAddresses);
addressRouter.post("/addresses", authenticate,customerAddressesController.addCustomerAddress);

// if the following attributes changes the lat and lng must also exist in input to be updated:
// label, country, city, street, building, apartmentNumber
addressRouter.patch("/addresses/:id",authenticate, customerAddressesController.editCustomerAddress);
addressRouter.delete("/addresses/:id",authenticate, customerAddressesController.deleteCustomerAddress);


