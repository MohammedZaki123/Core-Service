"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
class Permission {
    id;
    resource;
    action;
    constructor(data) {
        this.id = data.id;
        this.resource = data.resource;
        this.action = data.action;
    }
}
exports.Permission = Permission;
