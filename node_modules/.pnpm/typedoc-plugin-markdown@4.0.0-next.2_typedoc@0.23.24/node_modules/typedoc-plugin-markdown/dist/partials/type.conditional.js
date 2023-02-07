"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conditionalType = void 0;
function conditionalType(context, conditionalType) {
    const md = [];
    if (conditionalType.checkType) {
        md.push(context.partials.someType(conditionalType.checkType));
    }
    md.push('extends');
    if (conditionalType.extendsType) {
        md.push(context.partials.someType(conditionalType.extendsType));
    }
    md.push('?');
    if (conditionalType.trueType) {
        md.push(context.partials.someType(conditionalType.trueType));
    }
    md.push(':');
    if (conditionalType.falseType) {
        md.push(context.partials.someType(conditionalType.falseType));
    }
    return md.join(' ');
}
exports.conditionalType = conditionalType;
