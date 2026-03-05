import { Request, Response , NextFunction} from "express";
import {CustomerAddressesService, customerAddressesService} from "../service/address.service.js";
import {validateBody, validatePathParameter} from "../../../common/validation/validate.js";
import {addCustomerAddressDto, editCustomerAddressesDTO} from "../dto/address.dto.js";
export class CustomerAddressesController {
    constructor(private readonly customerAddressesService: CustomerAddressesService) {

    }
    getCustomerAddresses = async (req: Request, res: Response, next: NextFunction) => {
    //     use authenticate layer to get userID from the token stored in cookie
    //     call service layer customerAddresses function
    //     add function returned data to response and send with 200 status code
        try{
            const userId = req.user?.userId!;
            const addresses = await customerAddressesService.getCustomerAddresses(userId);
            res.status(200).json(addresses);
        }catch(error){
            next();
        }
    }

    addCustomerAddress = async (req: Request, res: Response, next: NextFunction) => {
        //     use authenticate layer to get userID from the token stored in cookie
        // call validateBody with addCustomerAddressDto to validate request body
        //     call service layer addCustomerAddress function
        // try{
            console.log("test_controller");
            const userId = req.user?.userId!;
            console.log("test_controller1");
            const validatedData = await validateBody(addCustomerAddressDto, req.body);
            console.log("test_controller2");
            const user = await customerAddressesService.addCustomerAddress(userId, validatedData);
            res.status(201).json({
                message: "Address added successfully",
                address: user
            });
        // }catch(error){
        //     next();
        // }
    }

    editCustomerAddress = async (req: Request, res: Response, next: NextFunction)=>{
        try{
            // 1. Extract and validate address ID from path parameter
            const addressId = validatePathParameter(req.params.id, "Address ID");

            // 2. Validate request body input and return cleaned data
            const userId = req.user?.userId!;
            const validatedData = await validateBody(editCustomerAddressesDTO, req.body);

            // 3. Call update function of service layer
            const result = await this.customerAddressesService.updateCustomerAddress(
                userId,
                addressId,
                validatedData
            );

            // 4. Return response
            res.status(200).json({
                message: "Address updated successfully",
                address: result
            });
        }catch(error){
            next(error);
        }
    }

    deleteCustomerAddress = async (req: Request, res: Response, next: NextFunction) => {
        try{
            // 1. Extract and validate address ID from path parameter
            const addressId = validatePathParameter(req.params.id, "Address ID");

            // 2. Get user ID from authenticated token
            const userId = req.user?.userId!;

            // 3. Call delete function of service layer
            await this.customerAddressesService.deleteCustomerAddress(userId, addressId);

            // 4. Return 204 No Content (standard for successful deletion)
            res.status(204).send();
        }catch(error){
            next(error);
        }
    }

}

export const customerAddressesController = new CustomerAddressesController(customerAddressesService);

