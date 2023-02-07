"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("@testing-library/react");
const msw_1 = require("msw");
const mocks_1 = require("./helpers/mocks");
const logger_1 = __importDefault(require("../../utils/logger"));
const react_2 = require("react");
const react_3 = require("../../react");
const utils_1 = require("./helpers/utils");
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
beforeAll(() => mocks_1.server.listen());
beforeEach(() => {
    // eslint-disable-next-line no-proto
    jest.spyOn(window.localStorage.__proto__, "setItem");
});
afterEach(() => {
    mocks_1.server.resetHandlers();
    jest.clearAllMocks();
});
afterAll(() => {
    mocks_1.server.close();
});
test("if it can fetch the session, it should store it in `localStorage`", async () => {
    (0, react_1.render)((0, jsx_runtime_1.jsx)(SessionFlow, {}));
    // In the start, there is no session
    const noSession = await react_1.screen.findByText("No session");
    expect(noSession).toBeInTheDocument();
    // After we fetched the session, it should have been rendered by `<SessionFlow />`
    const session = await react_1.screen.findByText(new RegExp(mocks_1.mockSession.user.name));
    expect(session).toBeInTheDocument();
    const broadcastCalls = (0, utils_1.getBroadcastEvents)();
    const [broadcastedEvent] = broadcastCalls;
    expect(broadcastCalls).toHaveLength(1);
    expect(broadcastCalls).toHaveLength(1);
    expect(broadcastedEvent.eventName).toBe("nextauth.message");
    expect(broadcastedEvent.value).toStrictEqual({
        data: {
            trigger: "getSession",
        },
        event: "session",
    });
});
test("if there's an error fetching the session, it should log it", async () => {
    mocks_1.server.use(msw_1.rest.get("*/api/auth/session", (req, res, ctx) => {
        return res(ctx.status(500), ctx.body("Server error"));
    }));
    (0, react_1.render)((0, jsx_runtime_1.jsx)(SessionFlow, {}));
    await (0, react_1.waitFor)(() => {
        expect(logger_1.default.error).toHaveBeenCalledTimes(1);
        expect(logger_1.default.error).toBeCalledWith("CLIENT_FETCH_ERROR", {
            url: "/api/auth/session",
            error: new SyntaxError("Unexpected token S in JSON at position 0"),
        });
    });
});
function SessionFlow() {
    const [session, setSession] = (0, react_2.useState)(null);
    (0, react_2.useEffect)(() => {
        async function fetchUserSession() {
            try {
                const result = await (0, react_3.getSession)();
                setSession(result);
            }
            catch (e) {
                console.error(e);
            }
        }
        fetchUserSession();
    }, []);
    if (session)
        return (0, jsx_runtime_1.jsx)("pre", { children: JSON.stringify(session, null, 2) });
    return (0, jsx_runtime_1.jsx)("p", { children: "No session" });
}
