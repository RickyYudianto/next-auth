"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const msw_1 = require("msw");
const react_hooks_1 = require("@testing-library/react-hooks");
const react_1 = require("@testing-library/react");
const react_2 = require("../../react");
const mocks_1 = require("./helpers/mocks");
const origConsoleError = console.error;
const { location } = window;
let _href = window.location.href;
beforeAll(() => {
    // Prevent noise on the terminal... `next-auth` will log to `console.error`
    // every time a request fails, which makes the tests output very noisy...
    console.error = jest.fn();
    // Allows to mutate `window.location`...
    delete window.location;
    window.location = {};
    Object.defineProperty(window.location, "href", {
        get: () => _href,
        // whatwg-fetch or whatwg-url does not seem to work with relative URLs
        set: (href) => {
            _href = href.startsWith("/") ? `http://localhost${href}` : href;
            return _href;
        },
    });
    mocks_1.server.listen();
});
afterEach(() => {
    mocks_1.server.resetHandlers();
    _href = "http://localhost/";
    // clear the internal session cache...
    (0, react_2.signOut)({ redirect: false });
});
afterAll(() => {
    console.error = origConsoleError;
    window.location = location;
    mocks_1.server.close();
});
test("it won't allow to fetch the session in isolation without a session context", () => {
    function App() {
        (0, react_2.useSession)();
        return null;
    }
    expect(() => (0, react_1.render)((0, jsx_runtime_1.jsx)(App, {}))).toThrow("[next-auth]: `useSession` must be wrapped in a <SessionProvider />");
});
test("when fetching the session, there won't be `data` and `status` will be 'loading'", () => {
    const { result } = (0, react_hooks_1.renderHook)(() => (0, react_2.useSession)(), {
        wrapper: react_2.SessionProvider,
    });
    expect(result.current.data).toBe(undefined);
    expect(result.current.status).toBe("loading");
});
test("when session is fetched, `data` will contain the session data and `status` will be 'authenticated'", async () => {
    const { result } = (0, react_hooks_1.renderHook)(() => (0, react_2.useSession)(), {
        wrapper: react_2.SessionProvider,
    });
    await (0, react_1.waitFor)(() => {
        expect(result.current.data).toEqual(mocks_1.mockSession);
        expect(result.current.status).toBe("authenticated");
    });
});
test("when it fails to fetch the session, `data` will be null and `status` will be 'unauthenticated'", async () => {
    mocks_1.server.use(msw_1.rest.get(`http://localhost/api/auth/session`, (_, res, ctx) => res(ctx.status(401), ctx.json({}))));
    const { result } = (0, react_hooks_1.renderHook)(() => (0, react_2.useSession)(), {
        wrapper: react_2.SessionProvider,
    });
    return (0, react_1.waitFor)(() => {
        expect(result.current.data).toEqual(null);
        expect(result.current.status).toBe("unauthenticated");
    });
});
test("it'll redirect to sign-in page if the session is required and the user is not authenticated", async () => {
    mocks_1.server.use(msw_1.rest.get(`http://localhost/api/auth/session`, (req, res, ctx) => res(ctx.status(401), ctx.json({}))));
    const callbackUrl = window.location.href;
    const { result } = (0, react_hooks_1.renderHook)(() => (0, react_2.useSession)({ required: true }), {
        wrapper: react_2.SessionProvider,
    });
    await (0, react_1.waitFor)(() => {
        expect(result.current.data).toEqual(null);
        expect(result.current.status).toBe("loading");
    });
    expect(window.location.href).toBe(`http://localhost/api/auth/signin?${new URLSearchParams({
        error: "SessionRequired",
        callbackUrl,
    })}`);
});
test("will call custom redirect logic if supplied when the user could not authenticate", async () => {
    mocks_1.server.use(msw_1.rest.get(`http://localhost/api/auth/session`, (_, res, ctx) => res(ctx.status(401), ctx.json({}))));
    const customRedirect = jest.fn();
    const { result } = (0, react_hooks_1.renderHook)(() => (0, react_2.useSession)({ required: true, onUnauthenticated: customRedirect }), {
        wrapper: react_2.SessionProvider,
    });
    await (0, react_1.waitFor)(() => {
        expect(result.current.data).toEqual(null);
        expect(result.current.status).toBe("loading");
    });
    expect(customRedirect).toHaveBeenCalledTimes(1);
});
