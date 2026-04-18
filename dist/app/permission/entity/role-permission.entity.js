"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermission = void 0;
class RolePermission {
    id;
    role;
    permissionId;
    constructor(data) {
        this.id = data.id;
        this.role = data.role;
        this.permissionId = data.permissionId;
    }
}
exports.RolePermission = RolePermission;
