"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const category_repository_1 = require("../repository/category.repository");
const enums_1 = require("../../user/enums");
const restaurant_repo_1 = require("../../restaurant/repository/restaurant.repo");
const errors_1 = require("../../restaurant/errors");
const product_repository_1 = require("../repository/product.repository");
const errors_2 = require("../../../lib/auth/errors");
const branch_repo_1 = require("../../branch/repository/branch.repo");
const errors_3 = require("../../branch/errors");
const errors_4 = require("../errors");
const knex_1 = require("../../../lib/knex/knex");
const product_details_repository_1 = require("../repository/product-details.repository");
const tsyringe_1 = require("tsyringe");
const cursor_pagination_1 = require("../../../lib/http/pagination/cursor-pagination");
let ProductService = class ProductService {
    findCategories = async (restaurantId, params, filters) => {
        const restaurant = (0, restaurant_repo_1.getRestaurantById)(restaurantId);
        if (!restaurant) {
            throw errors_1.RestaurantDoesNotExist;
        }
        const categories = await (0, category_repository_1.findCategoriesByRestaurant)(restaurantId, params, filters);
        if (params) {
            return (0, cursor_pagination_1.buildPaginationResult)(categories, params.limit, params.sortBy);
        }
        return { data: categories, meta: { nextCursor: null, hasMore: false, count: categories.length } };
    };
    findByRestaurant = async (restaurantId, role, userId, params, filters) => {
        const restaurant = await (0, restaurant_repo_1.getRestaurantById)(restaurantId);
        if (!restaurant)
            throw errors_1.RestaurantDoesNotExist;
        if (role !== enums_1.SystemRole.SYSTEM_ADMIN && Number(restaurant.ownerId) !== Number(userId)) {
            throw errors_2.NotAuthorized;
        }
        const products = await (0, product_repository_1.findProductsByRestaurant)(restaurantId, params, filters);
        if (params) {
            return (0, cursor_pagination_1.buildPaginationResult)(products, params.limit, params.sortBy);
        }
        return { data: products, meta: { nextCursor: null, hasMore: false, count: products.length } };
    };
    findByBranch = async (branchId, params, filters) => {
        const branch = await (0, branch_repo_1.getBranchById)(branchId);
        if (!branch) {
            throw errors_3.BranchNotFound;
        }
        const products = await (0, product_repository_1.findProductByBranch)(branchId, params, filters);
        if (params) {
            return (0, cursor_pagination_1.buildPaginationResult)(products, params.limit, params.sortBy);
        }
        return { data: products, meta: { nextCursor: null, hasMore: false, count: products.length } };
    };
    findById = async (id) => {
        const product = await (0, product_repository_1.findProductById)(id);
        if (!product) {
            throw errors_4.ProductDoesNotExist;
        }
        return product;
    };
    create = async (restaurantId, role, userId, data) => {
        const restaurant = await (0, restaurant_repo_1.getRestaurantById)(restaurantId);
        if (!restaurant) {
            throw errors_1.RestaurantDoesNotExist;
        }
        // if(role !== SystemRole.SYSTEM_ADMIN && Number(userId) !== Number(restaurant.ownerId)){
        //     throw NotAuthorized;
        // }
        // TODO: Transaction involve: createCategory
        //  if categoryName value exists inside data DTO
        //     call getCategoryExistsByName from category.repository
        //     if exists take returned object id and add it to new product Object
        //     if not: call createCategory function from category.repository
        const now = new Date();
        const trx = await knex_1.db.transaction();
        try {
            let categoryId = undefined;
            if (data.categoryName !== undefined) {
                let category = await (0, category_repository_1.findCategoryByName)(restaurantId, data.categoryName);
                // in both cases categoryId variable will be set to the new or the existed
                if (!category) {
                    category = await (0, category_repository_1.createCategory)({
                        restaurantId: restaurantId,
                        name: data.categoryName,
                        createdAt: now,
                        updatedAt: now
                    }, trx);
                }
                categoryId = category.id;
            }
            const product = await (0, product_repository_1.createProduct)({
                name: data.name,
                description: data.description ?? "",
                imageUrl: data.imageUrl ?? "",
                restaurantId: restaurantId,
                categoryId: categoryId ?? null,
                createdAt: now,
                updatedAt: now,
            }, trx);
            await trx.commit();
            return product;
        }
        catch (error) {
            trx.rollback();
            throw error;
        }
    };
    update = async (productId, data, role, userId, branchId) => {
        const product = await (0, product_repository_1.findProductById)(productId);
        if (!product) {
            throw errors_4.ProductDoesNotExist;
        }
        const restaurant = await (0, restaurant_repo_1.getRestaurantById)(product.restaurantId);
        if (role !== enums_1.SystemRole.SYSTEM_ADMIN && Number(userId) !== Number(restaurant.ownerId)) {
            throw errors_2.NotAuthorized;
        }
        // More on DB Transactions later
        const trx = await knex_1.db.transaction();
        const now = new Date();
        try {
            let categoryId = undefined;
            let category;
            if (data.categoryName) {
                category = await (0, category_repository_1.findCategoryByName)(product.restaurantId, data.categoryName);
                if (!category) {
                    category = await (0, category_repository_1.createCategory)({ restaurantId: product.restaurantId,
                        name: data.categoryName,
                        createdAt: now,
                        updatedAt: now }, trx);
                }
                categoryId = category.id;
            }
            const updatedProduct = await (0, product_repository_1.updateProduct)(productId, {
                name: data.name,
                description: data.description,
                imageUrl: data.imageUrl,
                categoryId,
            }, trx);
            let branchDetails;
            if (branchId) {
                branchDetails = await (0, product_details_repository_1.updateBranchDetails)(branchId, productId, {
                    price: data.price,
                    stock: data.stock,
                    isAvailable: data.isAvailable,
                }, trx);
            }
            await trx.commit();
            return { result: { updatedProduct, category, branchDetails } };
        }
        catch (error) {
            await trx.rollback();
            throw error;
        }
    };
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, tsyringe_1.injectable)()
], ProductService);
