export function secondsToMilliseconds(seconds: number) {
    return seconds * 1000;
}

export function minutesToMilliseconds(minutes: number){
    return minutes * 60 * secondsToMilliseconds(1);
}

export function hoursToMilliseconds(hours: number){
    return hours * 60 * minutesToMilliseconds(1);
}

export function daysToMilliseconds(days: number){
    return days * 24 * hoursToMilliseconds(1);
}

export function weeksToMilliseconds(weeks: number) {
    return weeks * 7 * daysToMilliseconds(1);
}