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
const react_3 = require("../../react");
const logger_1 = __importDefault(require("../../utils/logger"));
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
test("when called it'll return the currently configured providers for sign in", async () => {
    (0, react_2.render)((0, jsx_runtime_1.jsx)(ProvidersFlow, {}));
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        expect(react_2.screen.getByTestId("providers-result").textContent).toEqual(JSON.stringify(mocks_1.mockProviders));
    });
});
test("when failing to fetch the providers, it'll log the error", async () => {
    mocks_1.server.use(msw_1.rest.get("*/api/auth/providers", (req, res, ctx) => res(ctx.status(500), ctx.text("some error happened"))));
    (0, react_2.render)((0, jsx_runtime_1.jsx)(ProvidersFlow, {}));
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        expect(logger_1.default.error).toHaveBeenCalledTimes(1);
        expect(logger_1.default.error).toBeCalledWith("CLIENT_FETCH_ERROR", {
            url: "/api/auth/providers",
            error: new SyntaxError("Unexpected token s in JSON at position 0"),
        });
    });
});
function ProvidersFlow() {
    const [response, setResponse] = (0, react_1.useState)();
    async function handleGerProviders() {
        const result = await (0, react_3.getProviders)();
        setResponse(result);
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { "data-testid": "providers-result", children: response === null
                    ? "null-response"
                    : JSON.stringify(response) || "no response" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleGerProviders, children: "Get Providers" })] }));
}
