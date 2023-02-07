"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownType = void 0;
const els_1 = require("../support/els");
function unknownType(context, model) {
    return (0, els_1.backTicks)(model.name);
}
exports.unknownType = unknownType;
