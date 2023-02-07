"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PLURALS = exports.URL_PREFIX = void 0;
const typedoc_1 = require("typedoc");
exports.URL_PREFIX = /^(http|ftp)s?:\/\//;
exports.PLURALS = {
    [typedoc_1.ReflectionKind.Class]: 'Classes',
    [typedoc_1.ReflectionKind.Property]: 'Properties',
    [typedoc_1.ReflectionKind.Enum]: 'Enumerations',
    [typedoc_1.ReflectionKind.EnumMember]: 'Enumeration members',
    [typedoc_1.ReflectionKind.TypeAlias]: 'Type aliases',
};
