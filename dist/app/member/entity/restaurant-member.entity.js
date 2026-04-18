"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantMember = void 0;
class RestaurantMember {
    id;
    userId;
    restaurantId;
    status;
    createdAt;
    rolePermissionsId;
    constructor(data) {
        this.id = data.id;
        this.userId = data.userId;
        this.restaurantId = data.restaurantId;
        this.status = data.status;
        this.createdAt = data.createdAt;
        this.rolePermissionsId = data.rolePermissionsId;
    }
}
exports.RestaurantMember = RestaurantMember;
