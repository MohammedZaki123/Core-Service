import {AddBranchDTO, PatchBranchDTO, PatchBranchStatusDTO} from "../dto/branch.dto";
import {
    createBranch, findNearByBranches, getBranchById,
    getBranchesByRestaurantId,
    updateBranch, updateBranchStatus
} from "../repository/branch.repo";
import {Branch} from "../entity/branch.entity";
import {BranchNotFound, EmptyInputData} from "../errors";
import {Currency} from "../enum";
import {SystemRole} from "../../user/enums";
import {getRestaurantById} from "../../restaurant/repository/restaurant.repo";
import {NotAuthorized} from "../../../lib/auth/errors";
import {RestaurantDoesNotExist} from "../../restaurant/errors";
import {injectable} from "tsyringe";
import {buildPaginationResult, FilterParams, PaginationParams} from "../../../lib/http/pagination/cursor-pagination";


@injectable()
export class BranchService {

    getBranches = async (restaurantID: number, params: PaginationParams, filters: FilterParams[])  => {
        const branches = await getBranchesByRestaurantId(restaurantID, params, filters);
        const filtered = this.filterBranches(branches);
            return buildPaginationResult(filtered, params.limit, params.sortBy);

    }
    createBranch = async (restaurantID: number,userId: number,role: SystemRole, data: AddBranchDTO) => {
    //     place restaurant ID inside DTO cleaned data
    //     call repo layer create branch function giving data as an input
    //     return branch object attributes except restaurantID , createdAt, updatedAt
    //     TODO: we need also to check the role of user if it is an admin or the owner of the restaurant based on restaurant ID
        const restaurant = await getRestaurantById(restaurantID);
        if(role != SystemRole.SYSTEM_ADMIN && (Number(restaurant?.ownerId!) !== Number(userId))){
            throw NotAuthorized;
        }
        const now = new Date()
        const branch = await createBranch({
            restaurantId : restaurantID,
            label: data.label,
            countryCode: data.countryCode,
            lat: data.lat,
            lng: data.lng,
            addressText: data.addressText,
            isActive: false,
            opensAt: data.opensAt,
            closesAt: data.closesAt,
            currency: data.currency,
            deliveryRadius: data.deliveryRadius,
            commission: 0,
            createdAt: now,
            updatedAt: now,
            acceptOrders: true
        });

        return branch;
    }

    editBranch = async (branchId: number , userId: number,role: SystemRole,data: PatchBranchDTO) => {
    // TODO:
    //  check if branch exist and check if restaurant exist
    //  checking the role of user in the system (owner of the restaurant in which branch belongs to and system admin allowed only)
    //  return call repository layer updatedBranch function
        const branch = await getBranchById(branchId);
        if(!branch){
            throw BranchNotFound;
        }

        const restaurant = await getRestaurantById(branch.restaurantId);

        if(!restaurant){
            throw RestaurantDoesNotExist;
        }

        if(role !== SystemRole.SYSTEM_ADMIN && Number(userId) !== Number(restaurant.ownerId)){
            throw NotAuthorized;
        }

    return await updateBranch(branchId, data);
    }

    editBranchStatus = async (branchId: number , role: SystemRole,data: PatchBranchStatusDTO) => {
    //     TODO:
    //      check if branch exist using branchId
    //      only system admin can change the branch isActive status
    //      call repository layer function updateBranch
        const branch = await getBranchById(branchId);
        if(!branch){
            throw BranchNotFound;
        }
        if(role !== SystemRole.SYSTEM_ADMIN){
            throw NotAuthorized;
        }
        return await updateBranchStatus(branchId, data);
    }

    // editBranchRadius = async (branchId: number , data: PutBranchDTO) => {
    // //     TODO:
    // //       this a put operation so i think there is more to conducted on this operation than updated just one field
    // //       only restaurant owner can change the branch delivery radius attribute
    // //       call repository layer function updateBranch
    //     const branch = await updateBranch(branchId, data);
    //     return {
    //         id: branch.id,
    //         label: branch.label,
    //         countryCode: branch.countryCode,
    //         lat: branch.lat,
    //         lng: branch.lng,
    //         isActive: branch.isActive,
    //         opensAt: branch.opensAt,
    //         closesAt: branch.closesAt,
    //         addressText: branch.addressText,
    //         acceptOrders: branch.acceptOrders,
    //         currency: branch.currency,
    //         commission: branch.commission,
    //         deliveryRadius: branch.deliveryRadius
    //     }
    // }
    findNearBy = async (lat: number, lng: number, params: PaginationParams, filters: FilterParams[]) => {
        const branches = await findNearByBranches(lat, lng, params, filters);

            return buildPaginationResult(branches, params.limit, params.sortBy);
        // return {data: branches, meta: {nextCursor: null, hasMore: false, count: branches.length}};
    }

    private filterBranches (branches: Branch[]) {
        const filteredBranches : Partial<Branch> [] = [];

        for(let i = 0 ; i < branches.length; i++){
            filteredBranches.push({
                id: branches[i].id,
                label: branches[i].label,
                countryCode: branches[i].countryCode,
                lat: branches[i].lat,
                lng: branches[i].lng,
                isActive: branches[i].isActive,
                deliveryRadius: branches[i].deliveryRadius,
                createdAt: branches[i].createdAt,
                updatedAt: branches[i].updatedAt
            })
        }
        return filteredBranches
    }
}
