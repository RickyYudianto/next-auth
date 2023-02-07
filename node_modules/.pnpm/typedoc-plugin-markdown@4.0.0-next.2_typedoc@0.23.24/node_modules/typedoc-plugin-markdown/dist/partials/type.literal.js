"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.literalType = void 0;
function literalType(context, literalType) {
    if (typeof literalType.value === 'bigint') {
        return `\`${literalType.value}n\``;
    }
    return `\`\`${JSON.stringify(literalType.value)}\`\``;
}
exports.literalType = literalType;
