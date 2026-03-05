"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerAddressesController = exports.CustomerAddressesController = void 0;
const address_service_js_1 = require("../service/address.service.js");
const validate_js_1 = require("../../../common/validation/validate.js");
const address_dto_js_1 = require("../dto/address.dto.js");
class CustomerAddressesController {
    customerAddressesService;
    constructor(customerAddressesService) {
        this.customerAddressesService = customerAddressesService;
    }
    getCustomerAddresses = async (req, res, next) => {
        //     use authenticate layer to get userID from the token stored in cookie
        //     call service layer customerAddresses function
        //     add function returned data to response and send with 200 status code
        try {
            const userId = req.user?.userId;
            const addresses = await address_service_js_1.customerAddressesService.getCustomerAddresses(userId);
            res.status(200).json(addresses);
        }
        catch (error) {
            next();
        }
    };
    addCustomerAddress = async (req, res, next) => {
        //     use authenticate layer to get userID from the token stored in cookie
        // call validateBody with addCustomerAddressDto to validate request body
        //     call service layer addCustomerAddress function
        // try{
        console.log("test_controller");
        const userId = req.user?.userId;
        console.log("test_controller1");
        const validatedData = await (0, validate_js_1.validateBody)(address_dto_js_1.addCustomerAddressDto, req.body);
        console.log("test_controller2");
        const user = await address_service_js_1.customerAddressesService.addCustomerAddress(userId, validatedData);
        res.status(201).json({
            message: "Address added successfully",
            address: user
        });
        // }catch(error){
        //     next();
        // }
    };
    editCustomerAddress = async (req, res, next) => {
        try {
            // 1. Extract and validate address ID from path parameter
            const addressId = (0, validate_js_1.validatePathParameter)(req.params.id, "Address ID");
            // 2. Validate request body input and return cleaned data
            const userId = req.user?.userId;
            const validatedData = await (0, validate_js_1.validateBody)(address_dto_js_1.editCustomerAddressesDTO, req.body);
            // 3. Call update function of service layer
            const result = await this.customerAddressesService.updateCustomerAddress(userId, addressId, validatedData);
            // 4. Return response
            res.status(200).json({
                message: "Address updated successfully",
                address: result
            });
        }
        catch (error) {
            next(error);
        }
    };
    deleteCustomerAddress = async (req, res, next) => {
        try {
            // 1. Extract and validate address ID from path parameter
            const addressId = (0, validate_js_1.validatePathParameter)(req.params.id, "Address ID");
            // 2. Get user ID from authenticated token
            const userId = req.user?.userId;
            // 3. Call delete function of service layer
            await this.customerAddressesService.deleteCustomerAddress(userId, addressId);
            // 4. Return 204 No Content (standard for successful deletion)
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    };
}
exports.CustomerAddressesController = CustomerAddressesController;
exports.customerAddressesController = new CustomerAddressesController(address_service_js_1.customerAddressesService);
