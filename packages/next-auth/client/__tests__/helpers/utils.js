"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printFetchCalls = exports.getBroadcastEvents = void 0;
function getBroadcastEvents() {
    return window.localStorage.setItem.mock.calls
        .filter((call) => call[0] === "nextauth.message")
        .map(([eventName, value]) => {
        const { timestamp, ...rest } = JSON.parse(value);
        return { eventName, value: rest };
    });
}
exports.getBroadcastEvents = getBroadcastEvents;
function printFetchCalls(mockCalls) {
    return mockCalls.map(([path, { method = "GET" }]) => {
        return `${method.toUpperCase()} ${path}`;
    });
}
exports.printFetchCalls = printFetchCalls;
