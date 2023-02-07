"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexAccessType = void 0;
function indexAccessType(context, model) {
    const md = [];
    if (model.objectType) {
        md.push(context.partials.someType(model.objectType));
    }
    if (model.indexType) {
        md.push(`[${context.partials.someType(model.indexType)}]`);
    }
    return md.join('');
}
exports.indexAccessType = indexAccessType;
