"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyLogger = exports.setLogger = void 0;
const errors_1 = require("../core/errors");
// TODO: better typing
/** Makes sure that error is always serializable */
function formatError(o) {
    var _a;
    if (o instanceof Error && !(o instanceof errors_1.UnknownError)) {
        return { message: o.message, stack: o.stack, name: o.name };
    }
    if (hasErrorProperty(o)) {
        o.error = formatError(o.error);
        o.message = (_a = o.message) !== null && _a !== void 0 ? _a : o.error.message;
    }
    return o;
}
function hasErrorProperty(x) {
    return !!(x === null || x === void 0 ? void 0 : x.error);
}
const _logger = {
    error(code, metadata) {
        metadata = formatError(metadata);
        console.error(`[next-auth][error][${code}]`, `\nhttps://next-auth.js.org/errors#${code.toLowerCase()}`, metadata.message, metadata);
    },
    warn(code) {
        console.warn(`[next-auth][warn][${code}]`, `\nhttps://next-auth.js.org/warnings#${code.toLowerCase()}`);
    },
    debug(code, metadata) {
        console.log(`[next-auth][debug][${code}]`, metadata);
    },
};
/**
 * Override the built-in logger with user's implementation.
 * Any `undefined` level will use the default logger.
 */
function setLogger(newLogger = {}, debug) {
    // Turn off debug logging if `debug` isn't set to `true`
    if (!debug)
        _logger.debug = () => { };
    if (newLogger.error)
        _logger.error = newLogger.error;
    if (newLogger.warn)
        _logger.warn = newLogger.warn;
    if (newLogger.debug)
        _logger.debug = newLogger.debug;
}
exports.setLogger = setLogger;
exports.default = _logger;
/** Serializes client-side log messages and sends them to the server */
function proxyLogger(logger = _logger, basePath) {
    try {
        if (typeof window === "undefined") {
            return logger;
        }
        const clientLogger = {};
        for (const level in logger) {
            clientLogger[level] = (code, metadata) => {
                _logger[level](code, metadata); // Logs to console
                if (level === "error") {
                    metadata = formatError(metadata);
                }
                ;
                metadata.client = true;
                const url = `${basePath}/_log`;
                const body = new URLSearchParams({ level, code, ...metadata });
                if (navigator.sendBeacon) {
                    return navigator.sendBeacon(url, body);
                }
                return fetch(url, { method: "POST", body, keepalive: true });
            };
        }
        return clientLogger;
    }
    catch {
        return _logger;
    }
}
exports.proxyLogger = proxyLogger;
