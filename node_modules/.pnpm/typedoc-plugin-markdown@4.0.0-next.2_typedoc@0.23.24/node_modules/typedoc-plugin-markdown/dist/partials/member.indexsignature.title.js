"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexSignatureTitle = void 0;
function indexSignatureTitle(context, signature) {
    const md = ['▪'];
    const params = signature.parameters
        ? signature.parameters.map((parameter) => {
            return parameter.type
                ? `${parameter.name}: ${context.partials.someType(parameter.type)}`
                : '';
        })
        : [];
    if (signature.type) {
        md.push(`\[${params.join('')}\]: ${context.partials.someType(signature.type)}`);
    }
    return md.join(' ');
}
exports.indexSignatureTitle = indexSignatureTitle;
