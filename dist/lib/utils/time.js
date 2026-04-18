"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMs = toMs;
const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
};
function toMs(value, unit) {
    return value * multipliers[unit];
}
