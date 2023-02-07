"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeParameters = void 0;
const els_1 = require("../support/els");
function typeParameters(context, typeParameters) {
    const md = [];
    typeParameters === null || typeParameters === void 0 ? void 0 : typeParameters.forEach((item) => {
        if (item.varianceModifier) {
            md.push(item.varianceModifier);
        }
        md.push(`- ${(0, els_1.backTicks)(item.name)}`);
        if (!!item.type) {
            md.push(` *extends* ${context.partials.someType(item.type)}`);
        }
        if (!!item.default) {
            md.push(` = ${context.partials.someType(item.default)}`);
        }
        if (item.comment) {
            md.push(context.partials.comment(item.comment));
        }
        md.push('\n');
    });
    return md.join('');
}
exports.typeParameters = typeParameters;
