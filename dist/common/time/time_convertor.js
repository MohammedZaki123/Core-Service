"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secondsToMilliseconds = secondsToMilliseconds;
exports.minutesToMilliseconds = minutesToMilliseconds;
exports.hoursToMilliseconds = hoursToMilliseconds;
exports.daysToMilliseconds = daysToMilliseconds;
exports.weeksToMilliseconds = weeksToMilliseconds;
function secondsToMilliseconds(seconds) {
    return seconds * 1000;
}
function minutesToMilliseconds(minutes) {
    return minutes * 60 * secondsToMilliseconds(1);
}
function hoursToMilliseconds(hours) {
    return hours * 60 * minutesToMilliseconds(1);
}
function daysToMilliseconds(days) {
    return days * 24 * hoursToMilliseconds(1);
}
function weeksToMilliseconds(weeks) {
    return weeks * 7 * daysToMilliseconds(1);
}
