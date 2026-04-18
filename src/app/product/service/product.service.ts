import {createCategory, findCategoriesByRestaurant, findCategoryByName} from "../repository/category.repository";
import {SystemRole} from "../../user/enums";
import {getRestaurantById} from "../../restaurant/repository/restaurant.repo";
import {RestaurantDoesNotExist} from "../../restaurant/errors";
import {
    createProduct,
    findProductByBranch,
    findProductById,
    findProductsByRestaurant, updateProduct
} from "../repository/product.repository";
import {NotAuthorized} from "../../../lib/auth/errors";
import {getBranchById} from "../../branch/repository/branch.repo";
import {BranchNotFound} from "../../branch/errors";
import {ProductDoesNotExist} from "../errors";
import {CreateProductDTO, UpdateProductDTO} from "../dto/product.dto";
import {db} from "../../../lib/knex/knex";
import {updateBranchDetails} from "../repository/product-details.repository";
import {injectable} from "tsyringe";
import {buildPaginationResult, FilterParams, PaginationParams} from "../../../lib/http/pagination/cursor-pagination";

@injectable()
export class ProductService {
    findCategories = async (restaurantId: number, params?: PaginationParams, filters?: FilterParams[]) => {
        const restaurant = getRestaurantById(restaurantId);
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
        const restaurant = await getRestaurantById(restaurantId);
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
        const branch = await getBranchById(branchId);
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
        const restaurant = await getRestaurantById(restaurantId);

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

        const product = await findProductById(productId);
        if(!product){
            throw ProductDoesNotExist
        }
        const restaurant = await getRestaurantById(product.restaurantId);


        if(role !== SystemRole.SYSTEM_ADMIN && Number(userId) !== Number(restaurant!.ownerId)){
            throw NotAuthorized;
        }

        // More on DB Transactions later
        const trx = await db.transaction();
        const now = new Date()
        try{
            let categoryId: number | undefined = undefined;
            let category;
            if (data.categoryName) {
                category = await findCategoryByName(product.restaurantId, data.categoryName);
                if (!category) {
                    category = await createCategory({ restaurantId: product.restaurantId,
                        name: data.categoryName,
                        createdAt: now,
                        updatedAt: now},trx);
                }
                categoryId = category.id;
            }

            const updatedProduct = await updateProduct(productId, {
                name: data.name,
                description: data.description,
                imageUrl: data.imageUrl,
                categoryId,
            },trx);
            let branchDetails;
            if (branchId) {
                branchDetails = await updateBranchDetails(branchId, productId, {
                    price: data.price,
                    stock: data.stock,
                    isAvailable: data.isAvailable,
                },trx);
            }
            await trx.commit();
            return {result: {updatedProduct,category,branchDetails}};
        }catch(error){
            await trx.rollback();
            throw error;
        }

    }
}
