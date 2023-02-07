"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKindPlural = exports.CATEGORY_POSITION = void 0;
const typedoc_1 = require("typedoc");
const PLURALS = {
    [typedoc_1.ReflectionKind.Class]: 'Classes',
    [typedoc_1.ReflectionKind.Property]: 'Properties',
    [typedoc_1.ReflectionKind.Enum]: 'Enumerations',
    [typedoc_1.ReflectionKind.EnumMember]: 'Enumeration members',
    [typedoc_1.ReflectionKind.TypeAlias]: 'Type aliases',
};
exports.CATEGORY_POSITION = {
    [typedoc_1.ReflectionKind.Module]: 1,
    [typedoc_1.ReflectionKind.Namespace]: 1,
    [typedoc_1.ReflectionKind.Enum]: 2,
    [typedoc_1.ReflectionKind.Class]: 3,
    [typedoc_1.ReflectionKind.Interface]: 4,
    [typedoc_1.ReflectionKind.TypeAlias]: 5,
    [typedoc_1.ReflectionKind.Variable]: 6,
    [typedoc_1.ReflectionKind.Function]: 7,
    [typedoc_1.ReflectionKind.ObjectLiteral]: 8,
};
function getKindPlural(kind) {
    if (kind in PLURALS) {
        return PLURALS[kind];
    }
    else {
        return getKindString(kind) + 's';
    }
}
exports.getKindPlural = getKindPlural;
function getKindString(kind) {
    let str = typedoc_1.ReflectionKind[kind];
    str = str.replace(/(.)([A-Z])/g, (_m, a, b) => a + ' ' + b.toLowerCase());
    return str;
}
