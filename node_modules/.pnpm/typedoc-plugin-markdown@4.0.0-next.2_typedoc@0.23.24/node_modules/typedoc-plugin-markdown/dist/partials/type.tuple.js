"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tupleType = void 0;
function tupleType(context, tupleType) {
    return `[${tupleType.elements
        .map((element) => context.partials.someType(element))
        .join(', ')}]`;
}
exports.tupleType = tupleType;
