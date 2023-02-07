"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parametersTable = void 0;
const typedoc_1 = require("typedoc");
const utils_1 = require("../support/utils");
function parametersTable(context, parameters) {
    const flattenParams = (current) => {
        var _a, _b, _c;
        return (_c = (_b = (_a = current.type) === null || _a === void 0 ? void 0 : _a.declaration) === null || _b === void 0 ? void 0 : _b.children) === null || _c === void 0 ? void 0 : _c.reduce((acc, child) => {
            const childObj = {
                ...child,
                name: `${current.name}.${child.name}`,
            };
            return parseParams(childObj, acc);
        }, []);
    };
    const parseParams = (current, acc) => {
        var _a, _b, _c, _d;
        const shouldFlatten = ((_b = (_a = current.type) === null || _a === void 0 ? void 0 : _a.declaration) === null || _b === void 0 ? void 0 : _b.kind) === typedoc_1.ReflectionKind.TypeLiteral &&
            ((_d = (_c = current.type) === null || _c === void 0 ? void 0 : _c.declaration) === null || _d === void 0 ? void 0 : _d.children);
        return shouldFlatten
            ? [...acc, current, ...flattenParams(current)]
            : [...acc, current];
    };
    return table(context, parameters.reduce((acc, current) => parseParams(current, acc), []));
}
exports.parametersTable = parametersTable;
function table(context, parameters) {
    const showDefaults = hasDefaultValues(parameters);
    const comments = parameters.map((param) => { var _a; return !!((_a = param.comment) === null || _a === void 0 ? void 0 : _a.hasVisibleComponent()); });
    const hasComments = !comments.every((value) => !value);
    const headers = ['Name', 'Type'];
    if (showDefaults) {
        headers.push('Default value');
    }
    if (hasComments) {
        headers.push('Description');
    }
    const rows = parameters.map((parameter) => {
        const row = [];
        const nbsp = ' ';
        const rest = parameter.flags.isRest ? '...' : '';
        const optional = parameter.flags.isOptional ? '?' : '';
        const isDestructuredParam = parameter.name == '__namedParameters';
        const isDestructuredParamProp = parameter.name.startsWith('__namedParameters.');
        if (isDestructuredParam) {
            row.push(`\`${rest}«destructured»\``);
        }
        else if (isDestructuredParamProp) {
            row.push(`›${nbsp}\`${rest}${parameter.name.slice(18)}${optional}\``);
        }
        else {
            row.push(`\`${rest}${parameter.name}${optional}\``);
        }
        row.push(parameter.type
            ? context.partials.someType(parameter.type, 'object')
            : "getReflectionType(parameter, 'object')");
        if (showDefaults) {
            row.push(getDefaultValue(parameter));
        }
        if (hasComments) {
            if (parameter.comment) {
                row.push((0, utils_1.stripLineBreaks)(context.partials.comment(parameter.comment)).replace(/\|/g, '\\|'));
            }
            else {
                row.push('-');
            }
        }
        return `| ${row.join(' | ')} |\n`;
    });
    const output = `\n| ${headers.join(' | ')} |\n| ${headers
        .map(() => ':------')
        .join(' | ')} |\n${rows.join('')}`;
    return output;
}
function getDefaultValue(parameter) {
    return parameter.defaultValue && parameter.defaultValue !== '...'
        ? `\`${parameter.defaultValue}\``
        : '`undefined`';
}
function hasDefaultValues(parameters) {
    const defaultValues = parameters.map((param) => param.defaultValue !== '{}' &&
        param.defaultValue !== '...' &&
        !!param.defaultValue);
    return !defaultValues.every((value) => !value);
}
