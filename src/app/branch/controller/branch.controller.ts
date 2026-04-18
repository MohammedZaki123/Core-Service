import {BranchService} from "../service/branch.service";
import {NextFunction, Request, Response} from "express";
import {validateBody, validatePathParameter} from "../../../lib/validation/validate";
import {AddBranchDTO, PatchBranchDTO, PatchBranchStatusDTO} from "../dto/branch.dto";
import {SystemRole} from "../../user/enums";
import {injectable, inject} from "tsyringe";
import {TOKENS} from "../../../lib/di/tokens";
import {sendSuccess, sendPaginated} from "../../../lib/http/response";
import {parseFilterQuery, parsePaginationQuery} from "../../../lib/http/pagination/parse-query";
import {PaginationParams} from "../../../lib/http/pagination/cursor-pagination";

@injectable()
export class BranchController {
    constructor(@inject(TOKENS.BranchService) private readonly branchService: BranchService) {
    }

    addBranch = async (req : Request, res: Response, next: NextFunction)=> {
        try{
            const restaurantId = validatePathParameter(req.params.restaurantId, "Restaurant ID");
            const validatedData = await validateBody(AddBranchDTO, req.body);
            const userId = req.user?.userId!;
            const role = req.user?.role! as SystemRole;
            const branch = await this.branchService.createBranch(restaurantId, userId,role,validatedData);
            sendSuccess(res, branch, 201);
        }catch(err){
            next(err);
        }
    }

    getNearbyBranches = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const lat = Number(req.query.lat);
            const lng = Number(req.query.lng);
            const params: PaginationParams = parsePaginationQuery(req.query, ['restaurantId','commission']);
            const filters = parseFilterQuery(req.query, ['commission', 'restaurantId', 'currency']);
            const result = await this.branchService.findNearBy(lat, lng, params, filters);
            sendPaginated(res, result.data, result.meta);
        }catch(err){
            next(err);
        }
    }

    findByRestaurant = async (req : Request, res: Response, next: NextFunction) => {
        try{
            const restaurantId = validatePathParameter(req.params.restaurantId, "Restaurant ID");
            const params: PaginationParams = parsePaginationQuery(req.query);
            const filters = parseFilterQuery(req.query, ['id', 'label', 'currency', 'is_active']);
            const result = await this.branchService.getBranches(restaurantId, params, filters);
            sendPaginated(res, result.data, result.meta);
        }catch(err) {
            next(err)
        }
    }

    patchBranch = async (req: Request , res: Response, next: NextFunction) => {
        try{
            const branchId = validatePathParameter(req.params.id, "Branch ID");
            const validatedData = await validateBody(PatchBranchDTO, req.body);
            const branch = await this.branchService.editBranch(branchId,req.user?.userId!, req.user?.role! as SystemRole,validatedData);
            sendSuccess(res, {
                branch
            });
        }catch(err){
            next(err);
        }
    }

    patchBranchStatus = async (req: Request , res: Response, next: NextFunction) => {
        try{
            const branchId = validatePathParameter(req.params.id, "Branch ID");
            const validatedData = await validateBody(PatchBranchStatusDTO, req.body);
            const branch = await this.branchService.editBranchStatus(branchId, req.user?.role! as SystemRole,validatedData);
            sendSuccess(res, {
               branch : {
                   id: branch.id,
                   isActive: branch.isActive,
                   acceptOrders: branch.acceptOrders,
                   commission: branch.commission
               }
            });
        }catch(err){
            next(err);
        }
    }

    // putBranch = async  (req: Request , res: Response, next: NextFunction) => {
    //     try{
    //         const branchId = validatePathParameter(req.params.id, "Branch ID");
    //         const validatedData = await validateBody(PutBranchDTO, req.body);
    //         const branch = this.branchService.editBranchRadius(branchId, validatedData);
    //         res.status(200).json({
    //             branch
    //         })
    //     }catch(err){
    //         next(err);
    //     }
    // }

}

