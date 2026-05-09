import {createCategory, findCategoriesByRestaurant, findCategoryByName} from "../repository/category.repository";
import {SystemRole} from "../../user/enums";
import {findRestaurantById} from "../../restaurant/repository/restaurant.repo";
import {RestaurantDoesNotExist} from "../../restaurant/errors";
import {
    createProduct,
    findProductByBranch,
    findProductById,
    findProductsByRestaurant, updateProduct
} from "../repository/product.repository";
import {NotAuthorized} from "../../../lib/auth/errors";
import {findBranchById} from "../../branch/repository/branch.repo";
import {BranchNotFound} from "../../branch/errors";
import {InvalidReserveItemsError, outOfStockError, ProductDoesNotExist} from "../errors";
import {CreateProductDTO, UpdateProductDTO} from "../dto/product.dto";
import {db} from "../../../lib/knex/knex";
import {updateBranchDetails} from "../repository/product-details.repository";
import {injectable} from "tsyringe";
import {buildPaginationResult, FilterParams, PaginationParams} from "../../../lib/http/pagination/cursor-pagination";
import {BranchProductRow, OutOfStockItem, ReserveStockApplied, ReserveStockInput, ReserveStockResult} from "../types";
import {insertOutboxEvent} from "../../../lib/events/outbox.repo";
import {EVENT_TYPES} from "../../../lib/events/event-types";

@injectable()
export class ProductService {
    findCategories = async (restaurantId: number, params?: PaginationParams, filters?: FilterParams[]) => {
        const restaurant = findRestaurantById(restaurantId);
        if(!restaurant){
            throw RestaurantDoesNotExist
        }
        const categories = await findCategoriesByRestaurant(restaurantId, params, filters);

        if(params) {
            return buildPaginationResult(categories, params.limit, params.sortBy);
        }

        return {data: categories, meta: {nextCursor: null, hasMore: false, count: categories.length}};
    }
    findByRestaurant = async (restaurantId: number, role: SystemRole, userId: number, params?: PaginationParams, filters?: FilterParams[]) => {
        const restaurant = await findRestaurantById(restaurantId);
        if (!restaurant) throw RestaurantDoesNotExist;
        if (role !== SystemRole.SYSTEM_ADMIN && Number(restaurant.ownerId) !== Number(userId)) {
            throw NotAuthorized;
        }
        const products = await findProductsByRestaurant(restaurantId, params, filters);

        if(params) {
            return buildPaginationResult(products, params.limit, params.sortBy);
        }

        return {data: products, meta: {nextCursor: null, hasMore: false, count: products.length}};
    }

    findByBranch = async (branchId: number, params?: PaginationParams, filters?: FilterParams[]) => {
        const branch = await findBranchById(branchId);
        if(!branch){
            throw BranchNotFound;
        }
        const products = await findProductByBranch(branchId, params, filters);
        if(params) {
            return buildPaginationResult(products, params.limit, params.sortBy);
        }

        return {data: products, meta: {nextCursor: null, hasMore: false, count: products.length}};
    }
    findById = async (id: number) => {
        const product = await findProductById(id)
        if(!product){
            throw ProductDoesNotExist
        }
        return product;
    }

    create = async (restaurantId: number, role: SystemRole, userId: number, data: CreateProductDTO) => {
        const restaurant = await findRestaurantById(restaurantId);

        if(!restaurant){
            throw RestaurantDoesNotExist;
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
        const trx = await db.transaction();
        try{
            let categoryId = undefined;
            if(data.categoryName !== undefined){
                let category = await findCategoryByName(restaurantId,data.categoryName);
                // in both cases categoryId variable will be set to the new or the existed
                if(!category){
                    category = await createCategory({
                        restaurantId: restaurantId,
                        name: data.categoryName,
                        createdAt: now,
                        updatedAt: now
                    },trx)
                }
                categoryId = category.id;
            }

            const product = await createProduct({
                name: data.name,
                description: data.description ?? "",
                imageUrl: data.imageUrl ?? "",
                restaurantId: restaurantId,
                categoryId: categoryId ?? null,
                createdAt: now,
                updatedAt: now,
            },trx);
            await trx.commit();
            return product;
        }catch(error){
             trx.rollback();
            throw error;
        }
    }
    update = async (productId: number, data: UpdateProductDTO, role: SystemRole, userId: number,branchId?: number) => {
        const now = new Date()
        const product = await findProductById(productId);
        if (!product) {
            throw ProductDoesNotExist
        }
        const restaurant = await findRestaurantById(product.restaurantId);


        if (role !== SystemRole.SYSTEM_ADMIN && Number(userId) !== Number(restaurant!.ownerId)) {
            throw NotAuthorized;
        }

        let categoryId: number | undefined = undefined;
        let category;
        if (data.categoryName) {
            category = await findCategoryByName(product.restaurantId, data.categoryName);
            if (!category) {
                category = await createCategory({
                    restaurantId: product.restaurantId,
                    name: data.categoryName,
                    createdAt: now,
                    updatedAt: now
                });
            }
            categoryId = category.id;
        }

        const updatedProduct = await updateProduct(productId, {
            name: data.name,
            description: data.description,
            imageUrl: data.imageUrl,
            categoryId,
        });
        let branchDetails;
        // More on DB Transactions later
        const trx = await db.transaction();
        if (branchId) {
            try {
                const entity = await updateBranchDetails(branchId, productId, {
                    price: data.price,
                    stock: data.stock,
                    isAvailable: data.isAvailable,
                }, trx);

                if (data.price !== undefined) {
                    await insertOutboxEvent(trx, {
                        aggregateType: "product_branch_details",
                        aggregateId: `${branchId}:${productId}`,
                        eventType: EVENT_TYPES.PRODUCT_PRICE_CHANGED,
                        payload: {branchId, productId, newPrice: entity.price},
                    });
                }
                if (data.stock !== undefined || data.isAvailable !== undefined) {
                    await insertOutboxEvent(trx, {
                        aggregateType: "product_branch_details",
                        aggregateId: `${branchId}:${productId}`,
                        eventType: EVENT_TYPES.PRODUCT_STOCK_CHANGED,
                        payload: {
                            branchId,
                            productId,
                            newStock: entity.stock,
                            isAvailable: entity.isAvailable,
                        },
                    });
                }
                await trx.commit();
                branchDetails = entity;
            } catch (error) {
                await trx.rollback();
                throw error;
            }
        }

        return {result: {updatedProduct, category, branchDetails}};
    }
    /**
     * Atomically decrements branch stock for each item. Locks the rows FOR UPDATE
     * and emits product.stock.changed per decrement so order-service invalidates
     * its cache.
     */
    reserveStock = async (branchId: number, items: ReserveStockInput[]): Promise<ReserveStockResult> => {
        // TODO: Function Logic Algorithm Explained
        //  So order service sends a request to reserve stock for multiple items, we need to make sure that either all items are reserved or none of them are reserved to avoid partial reservation which can lead to bad user experience
        //  and also we need to make sure that the stock is not oversold so we need to check the stock before reserving it
        //  and if the stock is not enough we need to return the offending items with their available stock and requested quantity

        // sanitize and validate input for each item (productId and quantity should be positive integers)
        const sanitized = items
            .map((it) => ({productId: Number(it.productId), quantity: Number(it.quantity)}))
            .filter((it) => Number.isInteger(it.productId) && Number.isInteger(it.quantity) && it.quantity > 0);

        if (sanitized.length !== items.length) {
            throw InvalidReserveItemsError;
        }

        const productIds = sanitized.map((i) => i.productId);

        const trx = await db.transaction();
        try {
            // select stock for each product in the branch with FOR UPDATE to lock the rows until we finish the reservation process
            const rows = await trx("product_branch_details")
                .where("branch_id", branchId)
                .whereIn("product_id", productIds)
                .select("product_id", "stock", "is_available")
                .forUpdate();
            // creating a map of productId to stock and availability for easy lookup
            const byProduct = new Map<number, {stock: number; isAvailable: boolean}>();
            for (const r of rows) byProduct.set(Number(r.product_id), {stock: r.stock, isAvailable: r.is_available});

            // checking if the requested quantity is more than the available stock for any item,
            // if yes we need to make a rollback the transaction and return the offending items with their available stock and requested quantity
            const offending: OutOfStockItem[] = [];
            for (const it of sanitized) {
                const current = byProduct.get(it.productId);
                if (!current || !current.isAvailable) {
                    offending.push({productId: it.productId, requested: it.quantity, available: 0});
                    continue;
                }
                if (current.stock < it.quantity) {
                    offending.push({productId: it.productId, requested: it.quantity, available: current.stock});
                }
            }

            if (offending.length > 0) {
                throw outOfStockError(offending);
            }

            // iterating through every item again to decrement the stock for each item
            // and emitting product.stock.changed event for each item to invalidate the cache in order service
            // and also pushing the applied changes to an array to be returned in the response
            const applied: ReserveStockApplied[] = [];
            for (const it of sanitized) {
                const newStock = byProduct.get(it.productId)!.stock - it.quantity;
                await trx("product_branch_details")
                    .where("branch_id", branchId)
                    .where("product_id", it.productId)
                    .update({stock: newStock});
                applied.push({productId: it.productId, newStock});
            }

            for (const a of applied) {
                await insertOutboxEvent(trx, {
                    aggregateType: "product_branch_details",
                    aggregateId: `${branchId}:${a.productId}`,
                    eventType: EVENT_TYPES.PRODUCT_STOCK_CHANGED,
                    payload: {branchId, productId: a.productId, newStock: a.newStock},
                });
            }

            await trx.commit();
            return {ok: true, applied};
        } catch (err) {
            await trx.rollback();
            throw err;
        }
    }

    findByBranchAndIds = async (branchId: number, productIds: number[]): Promise<BranchProductRow[]> => {
        // TODO: should be placed in repo layer of product details but for now we can keep it here to
        //  avoid creating new function in repo layer that is only used once and
        //  also to avoid circular dependency between product details repo and product repo
        if (productIds.length === 0) return [];
        const rows = await db("product_branch_details as pbd")
            .join("products as p", "p.id", "pbd.product_id")
            .where("pbd.branch_id", branchId)
            .whereIn("pbd.product_id", productIds)
            .whereNull("p.deleted_at")
            .select(
                "pbd.product_id",
                "p.name",
                "p.image_url",
                "pbd.price",
                "pbd.stock",
                "pbd.is_available",
            );
        return rows.map((r: any) => ({
            productId: r.product_id,
            name: r.name,
            imageUrl: r.image_url,
            price: r.price,
            stock: r.stock,
            isAvailable: r.is_available,
        }));
    }
}
