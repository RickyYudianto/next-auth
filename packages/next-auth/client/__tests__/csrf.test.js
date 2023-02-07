"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
const react_2 = require("@testing-library/react");
const mocks_1 = require("./helpers/mocks");
const logger_1 = __importDefault(require("../../utils/logger"));
const react_3 = require("../../react");
const msw_1 = require("msw");
jest.mock("../../utils/logger", () => ({
    __esModule: true,
    default: {
        warn: jest.fn(),
        debug: jest.fn(),
        error: jest.fn(),
    },
    proxyLogger(logger) {
        return logger;
    },
}));
beforeAll(() => {
    mocks_1.server.listen();
});
afterEach(() => {
    mocks_1.server.resetHandlers();
    jest.clearAllMocks();
});
afterAll(() => {
    mocks_1.server.close();
});
test("returns the Cross Site Request Forgery Token (CSRF Token) required to make POST requests", async () => {
    (0, react_2.render)((0, jsx_runtime_1.jsx)(CSRFFlow, {}));
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        expect(react_2.screen.getByTestId("csrf-result").textContent).toEqual(mocks_1.mockCSRFToken.csrfToken);
    });
});
test("when there's no CSRF token returned, it'll reflect that", async () => {
    mocks_1.server.use(msw_1.rest.get("*/api/auth/csrf", (req, res, ctx) => res(ctx.status(200), ctx.json({
        ...mocks_1.mockCSRFToken,
        csrfToken: null,
    }))));
    (0, react_2.render)((0, jsx_runtime_1.jsx)(CSRFFlow, {}));
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        expect(react_2.screen.getByTestId("csrf-result").textContent).toBe("null-response");
    });
});
test("when the fetch fails it'll throw a client fetch error", async () => {
    mocks_1.server.use(msw_1.rest.get("*/api/auth/csrf", (req, res, ctx) => res(ctx.status(500), ctx.text("some error happened"))));
    (0, react_2.render)((0, jsx_runtime_1.jsx)(CSRFFlow, {}));
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        expect(logger_1.default.error).toHaveBeenCalledTimes(1);
        expect(logger_1.default.error).toBeCalledWith("CLIENT_FETCH_ERROR", {
            url: "/api/auth/csrf",
            error: new SyntaxError("Unexpected token s in JSON at position 0"),
        });
    });
});
function CSRFFlow() {
    const [response, setResponse] = (0, react_1.useState)();
    async function handleCSRF() {
        const result = await (0, react_3.getCsrfToken)();
        setResponse(result);
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { "data-testid": "csrf-result", children: response === null ? "null-response" : response || "no response" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleCSRF, children: "Get CSRF" })] }));
}
