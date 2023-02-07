"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toResponse = exports.toInternalRequest = void 0;
const cookie_1 = require("cookie");
const errors_1 = require("../core/errors");
const decoder = new TextDecoder();
async function streamToString(stream) {
    const chunks = [];
    return await new Promise((resolve, reject) => {
        stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on("error", (err) => reject(err));
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
}
async function readJSONBody(body) {
    try {
        if ("getReader" in body) {
            const reader = body.getReader();
            const bytes = [];
            while (true) {
                const { value, done } = await reader.read();
                if (done)
                    break;
                bytes.push(...value);
            }
            const b = new Uint8Array(bytes);
            return JSON.parse(decoder.decode(b));
        }
        // node-fetch
        if (typeof Buffer !== "undefined" && Buffer.isBuffer(body)) {
            return JSON.parse(body.toString("utf8"));
        }
        return JSON.parse(await streamToString(body));
    }
    catch (e) {
        console.error(e);
    }
}
// prettier-ignore
const actions = ["providers", "session", "csrf", "signin", "signout", "callback", "verify-request", "error", "_log"];
async function toInternalRequest(req) {
    var _a, _b, _c, _d;
    try {
        // TODO: url.toString() should not include action and providerId
        // see init.ts
        const url = new URL(req.url.replace(/\/$/, ""));
        const { pathname } = url;
        const action = actions.find((a) => pathname.includes(a));
        if (!action) {
            throw new errors_1.UnknownAction("Cannot detect action.");
        }
        const providerIdOrAction = pathname.split("/").pop();
        let providerId;
        if (providerIdOrAction &&
            !action.includes(providerIdOrAction) &&
            ["signin", "callback"].includes(action)) {
            providerId = providerIdOrAction;
        }
        return {
            url,
            action,
            providerId,
            method: (_a = req.method) !== null && _a !== void 0 ? _a : "GET",
            headers: Object.fromEntries(req.headers),
            body: req.body ? await readJSONBody(req.body) : undefined,
            cookies: (_c = (0, cookie_1.parse)((_b = req.headers.get("cookie")) !== null && _b !== void 0 ? _b : "")) !== null && _c !== void 0 ? _c : {},
            error: (_d = url.searchParams.get("error")) !== null && _d !== void 0 ? _d : undefined,
            query: Object.fromEntries(url.searchParams),
        };
    }
    catch (error) {
        return error;
    }
}
exports.toInternalRequest = toInternalRequest;
function toResponse(res) {
    var _a, _b;
    const headers = new Headers(res.headers);
    (_a = res.cookies) === null || _a === void 0 ? void 0 : _a.forEach((cookie) => {
        const { name, value, options } = cookie;
        const cookieHeader = (0, cookie_1.serialize)(name, value, options);
        if (headers.has("Set-Cookie")) {
            headers.append("Set-Cookie", cookieHeader);
        }
        else {
            headers.set("Set-Cookie", cookieHeader);
        }
    });
    const body = headers.get("content-type") === "application/json"
        ? JSON.stringify(res.body)
        : res.body;
    const response = new Response(body, {
        headers,
        status: res.redirect ? 302 : (_b = res.status) !== null && _b !== void 0 ? _b : 200,
    });
    if (res.redirect) {
        response.headers.set("Location", res.redirect);
    }
    return response;
}
exports.toResponse = toResponse;
