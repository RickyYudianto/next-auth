"use strict";
// Source: https://stackoverflow.com/a/34749873/5364135
Object.defineProperty(exports, "__esModule", { value: true });
exports.merge = void 0;
/** Simple object check */
function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
}
/** Deep merge two objects */
function merge(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key])
                    Object.assign(target, { [key]: {} });
                merge(target[key], source[key]);
            }
            else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return merge(target, ...sources);
}
exports.merge = merge;
