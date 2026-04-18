"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberController = exports.MemberController = void 0;
const member_service_1 = require("../service/member.service");
class MemberController {
    memberService;
    constructor(memberService) {
        this.memberService = memberService;
    }
    addMember = async (req, res, next) => {
    };
    getMembers = async (req, res, next) => {
    };
    updateMember = async (req, res, next) => {
    };
    deleteMember = async (req, res, next) => {
    };
}
exports.MemberController = MemberController;
exports.memberController = new MemberController(member_service_1.memberService);
