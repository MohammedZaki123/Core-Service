"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBranchById = getBranchById;
exports.createBranch = createBranch;
exports.getBranchesByRestaurantId = getBranchesByRestaurantId;
exports.updateBranch = updateBranch;
exports.getBranchesByLatAndLng = getBranchesByLatAndLng;
const knex_1 = require("../../../common/knex/knex");
const branch_entity_1 = require("../entity/branch.entity");
function toEntity(record) {
    return new branch_entity_1.Branch({
        id: record.id,
        restaurantId: record.restaurant_id,
        lat: record.lat,
        lng: record.lng,
        countryCode: record.country_code,
        label: record.label,
        isActive: record.is_active,
        opensAt: record.opens_at,
        closesAt: record.closes_at,
        addressText: record.address_text,
        acceptOrders: record.accept_orders,
        createdAt: record.created_at,
        updatedAt: record.updated_at,
        currency: record.currency,
        commission: record.commission,
        deliveryRadius: record.delivery_radius
    });
}
const BRANCH_COLUMNS = [
    "id", "restaurant_id", "lat", "lng", "country_code",
    "label", "is_active", "opens_at", "closes_at", "address_text",
    "accept_orders", "created_at", "updated_at", "currency", "commission", "delivery_radius"
];
async function getBranchById(id) {
    const record = await knex_1.db.select(BRANCH_COLUMNS).from("restaurant_branches").where('id', id).first();
    return record ? toEntity(record) : undefined;
}
async function createBranch(branch) {
    const record = await (0, knex_1.db)("restaurant_branches").insert({
        restaurant_id: branch.restaurantId,
        lat: branch.lat,
        lng: branch.lng,
        country_code: branch.countryCode,
        label: branch.label,
        is_active: branch.isActive,
        opens_at: branch.opensAt,
        closes_at: branch.closesAt,
        address_text: branch.addressText,
        accept_orders: branch.acceptOrders,
        created_at: new Date(),
        updated_at: new Date(),
        currency: branch.currency,
        commission: branch.commission,
        delivery_radius: branch.deliveryRadius
    }).returning(BRANCH_COLUMNS);
    return toEntity(record[0]);
}
async function getBranchesByRestaurantId(restaurantID) {
    const records = await knex_1.db.select(BRANCH_COLUMNS).from('restaurant_branches').where('restaurant_id', restaurantID);
    return records.map(toEntity);
}
async function updateBranch(branchId, branch) {
    const record = await (0, knex_1.db)("branches").where('id', branchId).update(branch).returning(BRANCH_COLUMNS);
    return toEntity(record[0]);
}
async function getBranchesByLatAndLng(lat, lng) {
    //     used to get the list of restaurants for customers request based on their near branches
    //     returns only list of restaurant_ids for records which are near lat and lng input variables in branches table
    //     TODO: the logic of lat and lng will be changed  in the future
    const records = await knex_1.db.select(BRANCH_COLUMNS).from('restaurant_branches').where('lat', lat).andWhere('lng', lng);
    return records.map(record => toEntity(record).restaurantId);
}
