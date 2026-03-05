import {createAddress, findAddressByCustomerID, getAddressesByUserId, updateAddress, deleteAddress} from "../repository/address.repo.js";
import {addCustomerAddressDto, editCustomerAddressesDTO} from "../dto/address.dto.js";
import {Address} from "../entity/address.entity.js";
import {cannotAccessAddress} from "../errors.js";

export class CustomerAddressesService {
    getCustomerAddresses = async (userId: number) => {
    //     calling getAddressesByUserId to fetch addresses from the database
    //     return every property of user object except userID and created_at
        const addresses = await getAddressesByUserId(userId);
        return this.filterAddresses(addresses);
    }

    addCustomerAddress = async (userId: number, data: addCustomerAddressDto) =>{
    //   calling addCustomerAddress to add new address to the database
        console.log("test_service");
        const address = await createAddress({
            userId : userId,
            label : data.label,
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
        }
    }
    updateCustomerAddress = async (userId: number, addressId: number ,data: editCustomerAddressesDTO)=>{
        // Check if customer is authorized to access address
        const is_exist = await findAddressByCustomerID(userId, addressId);

        // If not authorized throw a forbidden error
        if(!is_exist){
            throw cannotAccessAddress
        }

        // Call updateAddress function of repository layer
        const updatedAddress = await updateAddress({
            label : data.label,
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
        }
    }

    deleteCustomerAddress = async (userId: number, addressId: number) => {
        // Check if customer is authorized to access address
        const is_exist = await findAddressByCustomerID(userId, addressId);

        // If not authorized throw a forbidden error
        if(!is_exist){
            throw cannotAccessAddress
        }

        // Call delete function of repository layer
        await deleteAddress(addressId);
    }

    private filterAddresses(addresses: Address[]){
        const filteredAddresses: unknown[] = [];
        for(let i = 0 ; i < addresses.length; i++){
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
            })
        }
        return filteredAddresses;
    }

}

export const customerAddressesService = new CustomerAddressesService();

