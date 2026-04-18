"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchMember = void 0;
class BranchMember {
    id;
    memberId;
    branchId;
    constructor(data) {
        this.id = data.id;
        this.memberId = data.memberId;
        this.branchId = data.branchId;
    }
}
exports.BranchMember = BranchMember;
