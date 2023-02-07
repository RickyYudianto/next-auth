"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOperatorType = void 0;
function typeOperatorType(context, model) {
    return `${model.operator} ${context.partials.someType(model.target)}`;
}
exports.typeOperatorType = typeOperatorType;
