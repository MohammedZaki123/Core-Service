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
exports.ProductController = void 0;
const product_service_1 = require("../service/product.service");
const validate_1 = require("../../../lib/validation/validate");
const product_dto_1 = require("../dto/product.dto");
const tsyringe_1 = require("tsyringe");
const tokens_1 = require("../../../lib/di/tokens");
const response_1 = require("../../../lib/http/response");
const parse_query_1 = require("../../../lib/http/pagination/parse-query");
let ProductController = class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    findCategories = async (req, res, next) => {
        try {
            const restaurantId = (0, validate_1.validatePathParameter)(req.params.restaurantId, "Restaurant ID");
            const params = (0, parse_query_1.parsePaginationQuery)(req.query, ['id', 'name']);
            const filters = (0, parse_query_1.parseFilterQuery)(req.query, ['id', 'name']);
            const result = await this.productService.findCategories(restaurantId, params, filters);
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
            const filters = (0, parse_query_1.parseFilterQuery)(req.query, ['id', 'name', 'category_id']);
            const result = await this.productService.findByRestaurant(restaurantId, req.user?.role, req.user?.userId, params, filters);
            (0, response_1.sendPaginated)(res, result.data, result.meta);
        }
        catch (err) {
            next(err);
        }
    };
    findByBranch = async (req, res, next) => {
        try {
            const branchId = (0, validate_1.validatePathParameter)(req.params.branchId, "Branch ID");
            const params = (0, parse_query_1.parsePaginationQuery)(req.query, ['description', 'price', 'stock']);
            const filters = (0, parse_query_1.parseFilterQuery)(req.query, ['id', 'name', 'category_id']);
            const result = await this.productService.findByBranch(branchId, params, filters);
            (0, response_1.sendPaginated)(res, result.data, result.meta);
        }
        catch (err) {
            next(err);
        }
    };
    findById = async (req, res, next) => {
        try {
            const productId = (0, validate_1.validatePathParameter)(req.params.id, "Product ID");
            const result = await this.productService.findById(productId);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (err) {
            next(err);
        }
    };
    create = async (req, res, next) => {
        try {
            const restaurantId = (0, validate_1.validatePathParameter)(req.params.restaurantId, "Restaurant ID");
            const validatedData = await (0, validate_1.validateBody)(product_dto_1.CreateProductDTO, req.body);
            const result = await this.productService.create(restaurantId, req.user?.role, req.user?.userId, validatedData);
            (0, response_1.sendSuccess)(res, {
                product: result
            }, 201);
        }
        catch (err) {
            next(err);
        }
    };
    update = async (req, res, next) => {
        try {
            const productId = (0, validate_1.validatePathParameter)(req.params.id, "Product ID");
            const validatedData = await (0, validate_1.validateBody)(product_dto_1.UpdateProductDTO, req.body);
            const branchId = req.query.branchId ? Number(req.query.branchId) : undefined;
            const result = await this.productService.update(productId, validatedData, req.user?.role, req.user?.userId, branchId);
            (0, response_1.sendSuccess)(res, { message: "Product Updated Successfully", ...result });
        }
        catch (err) {
            next(err);
        }
    };
};
exports.ProductController = ProductController;
exports.ProductController = ProductController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.TOKENS.ProductService)),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
