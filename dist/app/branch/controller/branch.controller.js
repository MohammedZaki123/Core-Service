"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchController = void 0;
const branch_service_1 = require("../service/branch.service");
const validate_1 = require("../../../lib/validation/validate");
const branch_dto_1 = require("../dto/branch.dto");
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../lib/di/tokens");
const response_1 = require("../../../lib/http/response");
const parse_query_1 = require("../../../lib/http/pagination/parse-query");
let BranchController = class BranchController {
    branchService;
    constructor(branchService) {
        this.branchService = branchService;
    }
    addBranch = async (req, res, next) => {
        try {
            const restaurantId = (0, validate_1.validatePathParameter)(req.params.restaurantId, "Restaurant ID");
            const validatedData = await (0, validate_1.validateBody)(branch_dto_1.AddBranchDTO, req.body);
            const userId = req.user?.userId;
            const role = req.user?.role;
            const branch = await this.branchService.createBranch(restaurantId, userId, role, validatedData);
            (0, response_1.sendSuccess)(res, branch, 201);
        }
        catch (err) {
            next(err);
        }
    };
    getNearbyBranches = async (req, res, next) => {
        try {
            const lat = Number(req.query.lat);
            const lng = Number(req.query.lng);
            const params = (0, parse_query_1.parsePaginationQuery)(req.query, ['restaurantId', 'commission']);
            const filters = (0, parse_query_1.parseFilterQuery)(req.query, ['commission', 'restaurantId', 'currency']);
            const result = await this.branchService.findNearBy(lat, lng, params, filters);
            (0, response_1.sendPaginated)(res, result.data, result.meta);
        }
        catch (err) {
            next(err);
        }
    };
    findByRestaurant = async (req, res, next) => {
        try {
            const restaurantId = (0, validate_1.validatePathParameter)(req.params.restaurantId, "Restaurant ID");
            const params = (0, parse_query_1.parsePaginationQuery)(req.query);
            const filters = (0, parse_query_1.parseFilterQuery)(req.query, ['id', 'label', 'currency', 'is_active']);
            const result = await this.branchService.getBranches(restaurantId, params, filters);
            (0, response_1.sendPaginated)(res, result.data, result.meta);
        }
        catch (err) {
            next(err);
        }
    };
    patchBranch = async (req, res, next) => {
        try {
            const branchId = (0, validate_1.validatePathParameter)(req.params.id, "Branch ID");
            const validatedData = await (0, validate_1.validateBody)(branch_dto_1.PatchBranchDTO, req.body);
            const branch = await this.branchService.editBranch(branchId, req.user?.userId, req.user?.role, validatedData);
            (0, response_1.sendSuccess)(res, {
                branch
            });
        }
        catch (err) {
            next(err);
        }
    };
    patchBranchStatus = async (req, res, next) => {
        try {
            const branchId = (0, validate_1.validatePathParameter)(req.params.id, "Branch ID");
            const validatedData = await (0, validate_1.validateBody)(branch_dto_1.PatchBranchStatusDTO, req.body);
            const branch = await this.branchService.editBranchStatus(branchId, req.user?.role, validatedData);
            (0, response_1.sendSuccess)(res, {
                branch: {
                    id: branch.id,
                    isActive: branch.isActive,
                    acceptOrders: branch.acceptOrders,
                    commission: branch.commission
                }
            });
        }
        catch (err) {
            next(err);
        }
    };
};
exports.BranchController = BranchController;
exports.BranchController = BranchController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.BranchService)),
    __metadata("design:paramtypes", [branch_service_1.BranchService])
], BranchController);
