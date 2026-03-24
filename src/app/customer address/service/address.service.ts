import {
    createAddress, findAddressByCustomerID, getAddressesByUserId, updateAddress, deleteAddress,
    clearDefaultByUserId
} from "../repository/address.repo.js";
import {addCustomerAddressDto, editCustomerAddressesDTO} from "../dto/address.dto.js";
import {CustomerAddress} from "../entity/address.entity.js";
import {AddressDoesNotExist} from "../errors";

function toResponse(address: any) {
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
        isDefault: address.isDefault,
    };
}

export class CustomerAddressesService {
    getCustomerAddresses = async (userId: number) => {
    //     calling getAddressesByUserId to fetch addresses from the database
    //     return every property of user object except userID and created_at
        const addresses = await getAddressesByUserId(userId);
        return addresses.map(toResponse);
    }

    addCustomerAddress = async (userId: number, data: addCustomerAddressDto) =>{
    //   calling addCustomerAddress to add new address to the database
        if(data.isDefault){
            await clearDefaultByUserId(userId);
        }
        const address = await createAddress({
            userId : userId,
            ...data
        });

        return toResponse(address);
    }
    updateCustomerAddress = async (userId: number, addressId: number ,data: editCustomerAddressesDTO)=>{
        // Check if customer is authorized to access address
        const is_exist = await findAddressByCustomerID(userId, addressId);

        // If not authorized throw a forbidden error
        if(!is_exist){
            throw AddressDoesNotExist
        }
        if(data.isDefault){
            await clearDefaultByUserId(userId);
        }

        // Call updateAddress function of repository layer
        const updatedAddress = await updateAddress(data, addressId);

        // Return only needed attributes of the returned addresses object
        return toResponse(updatedAddress);
    }

    deleteCustomerAddress = async (userId: number, addressId: number) => {
        // Check if customer is authorized to access address
        const is_exist = await findAddressByCustomerID(userId, addressId);

        // If not authorized throw a forbidden error
        if(!is_exist){
            throw AddressDoesNotExist
        }

        // Call delete function of repository layer
        await deleteAddress(addressId);
    }

}

export const customerAddressesService = new CustomerAddressesService();

