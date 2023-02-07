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
const msw_1 = require("msw");
const utils_1 = require("./helpers/utils");
const { location } = window;
beforeAll(() => {
    mocks_1.server.listen();
    // Allows to mutate `window.location`...
    delete window.location;
    window.location = {
        reload: jest.fn(),
        href: location.href,
    };
});
beforeEach(() => {
    // eslint-disable-next-line no-proto
    jest.spyOn(window.localStorage.__proto__, "setItem");
});
afterEach(() => {
    jest.clearAllMocks();
    mocks_1.server.resetHandlers();
});
afterAll(() => {
    window.location = location;
    mocks_1.server.close();
});
const callbackUrl = "https://redirects/to";
test("by default it redirects to the current URL if the server did not provide one", async () => {
    mocks_1.server.use(msw_1.rest.post("*/api/auth/signout", (req, res, ctx) => res(ctx.status(200), ctx.json({ ...mocks_1.mockSignOutResponse, url: undefined }))));
    (0, react_2.render)((0, jsx_runtime_1.jsx)(SignOutFlow, {}));
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        expect(window.location.href).toBe(window.location.href);
    });
});
test("it redirects to the URL allowed by the server", async () => {
    (0, react_2.render)((0, jsx_runtime_1.jsx)(SignOutFlow, { callbackUrl: callbackUrl }));
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        expect(window.location.href).toBe(mocks_1.mockSignOutResponse.url);
    });
});
test("if url contains a hash during redirection a page reload happens", async () => {
    const mockUrlWithHash = "https://path/to/email/url#foo-bar-baz";
    mocks_1.server.use(msw_1.rest.post("*/api/auth/signout", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            ...mocks_1.mockSignOutResponse,
            url: mockUrlWithHash,
        }));
    }));
    (0, react_2.render)((0, jsx_runtime_1.jsx)(SignOutFlow, {}));
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        expect(window.location.href).toBe(mockUrlWithHash);
    });
});
test("will broadcast the signout event to other tabs", async () => {
    (0, react_2.render)((0, jsx_runtime_1.jsx)(SignOutFlow, {}));
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        const broadcastCalls = (0, utils_1.getBroadcastEvents)();
        const [broadcastedEvent] = broadcastCalls;
        expect(broadcastCalls).toHaveLength(1);
        expect(broadcastedEvent.eventName).toBe("nextauth.message");
        expect(broadcastedEvent.value).toStrictEqual({
            data: {
                trigger: "signout",
            },
            event: "session",
        });
    });
});
function SignOutFlow({ callbackUrl, redirect = true }) {
    const [response, setResponse] = (0, react_1.useState)(null);
    async function handleSignOut() {
        const result = await (0, react_3.signOut)({ callbackUrl, redirect });
        setResponse(result);
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { "data-testid": "signout-result", children: response ? JSON.stringify(response) : "no response" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSignOut, children: "Sign out" })] }));
}
