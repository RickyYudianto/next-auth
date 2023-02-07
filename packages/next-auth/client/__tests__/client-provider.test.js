"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const msw_1 = require("msw");
const react_1 = require("@testing-library/react");
const mocks_1 = require("./helpers/mocks");
const utils_1 = require("./helpers/utils");
const react_2 = require("../../react");
const origDocumentVisibility = document.visibilityState;
const fetchSpy = jest.spyOn(global, "fetch");
beforeAll(() => {
    mocks_1.server.listen();
});
afterEach(() => {
    mocks_1.server.resetHandlers();
    changeTabVisibility(origDocumentVisibility);
    fetchSpy.mockClear();
});
afterAll(() => {
    mocks_1.server.close();
});
test("fetches the session once and re-uses it for different consumers", async () => {
    (0, react_1.render)((0, jsx_runtime_1.jsx)(ProviderFlow, {}));
    expect(react_1.screen.getByTestId("session-1")).toHaveTextContent("loading");
    expect(react_1.screen.getByTestId("session-2")).toHaveTextContent("loading");
    return (0, react_1.waitFor)(() => {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith("/api/auth/session", expect.anything());
        const session1 = react_1.screen.getByTestId("session-1").textContent;
        const session2 = react_1.screen.getByTestId("session-2").textContent;
        expect(session1).toEqual(session2);
    });
});
test("when there's an existing session, it won't try to fetch a new one straightaway", async () => {
    (0, react_1.render)((0, jsx_runtime_1.jsx)(ProviderFlow, { session: mocks_1.mockSession }));
    expect(fetchSpy).not.toHaveBeenCalled();
});
test("will refetch the session when the browser tab becomes active again", async () => {
    (0, react_1.render)((0, jsx_runtime_1.jsx)(ProviderFlow, { session: mocks_1.mockSession }));
    expect(fetchSpy).not.toHaveBeenCalled();
    // Hide the current tab
    changeTabVisibility("hidden");
    // Given the current tab got hidden, it should not attempt to re-fetch the session
    expect(fetchSpy).not.toHaveBeenCalled();
    // Make the tab again visible
    changeTabVisibility("visible");
    // Given the user made the tab visible again, now attempts to sync and re-fetch the session
    return (0, react_1.waitFor)(() => {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith("/api/auth/session", expect.anything());
    });
});
test("will refetch the session if told to do so programmatically from another window", async () => {
    (0, react_1.render)((0, jsx_runtime_1.jsx)(ProviderFlow, { session: mocks_1.mockSession }));
    expect(fetchSpy).not.toHaveBeenCalled();
    // Hide the current tab
    changeTabVisibility("hidden");
    // Given the current tab got hidden, it should not attempt to re-fetch the session
    expect(fetchSpy).not.toHaveBeenCalled();
    // simulate sign-out triggered by another tab
    (0, react_2.signOut)({ redirect: false });
    // Given signed out in another tab, it attempts to sync and re-fetch the session
    return (0, react_1.waitFor)(() => {
        expect(fetchSpy).toHaveBeenCalledWith("/api/auth/session", expect.anything());
        // We should have a call to sign-out and a call to refetch the session accordingly
        expect((0, utils_1.printFetchCalls)(fetchSpy.mock.calls)).toMatchInlineSnapshot(`
      Array [
        "GET /api/auth/csrf",
        "POST /api/auth/signout",
        "GET /api/auth/session",
      ]
    `);
    });
});
test("allows to customize how often the session will be re-fetched through polling", () => {
    jest.useFakeTimers();
    (0, react_1.render)((0, jsx_runtime_1.jsx)(ProviderFlow, { session: mocks_1.mockSession, refetchInterval: 1 }));
    // we provided a mock session so it shouldn't try to fetch a new one
    expect(fetchSpy).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith("/api/auth/session", expect.anything());
    jest.advanceTimersByTime(1000);
    // it should have tried to refetch the session, hence counting 2 calls to the session endpoint
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect((0, utils_1.printFetchCalls)(fetchSpy.mock.calls)).toMatchInlineSnapshot(`
      Array [
        "GET /api/auth/session",
        "GET /api/auth/session",
      ]
    `);
});
test("allows to customize the URL for session fetching", async () => {
    const myPath = "/api/v1/auth";
    mocks_1.server.use(msw_1.rest.get(`${myPath}/session`, (req, res, ctx) => res(ctx.status(200), ctx.json(mocks_1.mockSession))));
    (0, react_1.render)((0, jsx_runtime_1.jsx)(ProviderFlow, { session: mocks_1.mockSession, basePath: myPath }));
    // there's an existing session so it should not try to fetch a new one
    expect(fetchSpy).not.toHaveBeenCalled();
    // force a session refetch across all clients...
    (0, react_2.getSession)();
    return (0, react_1.waitFor)(() => {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(fetchSpy).toHaveBeenCalledWith(`${myPath}/session`, expect.anything());
    });
});
function ProviderFlow(props) {
    return ((0, jsx_runtime_1.jsxs)(react_2.SessionProvider, { ...props, children: [(0, jsx_runtime_1.jsx)(SessionConsumer, {}), (0, jsx_runtime_1.jsx)(SessionConsumer, { testId: "2" })] }));
}
function SessionConsumer({ testId = 1, ...rest }) {
    const { data: session, status } = (0, react_2.useSession)(rest);
    return ((0, jsx_runtime_1.jsx)("div", { "data-testid": `session-${testId}`, children: status === "loading" ? "loading" : JSON.stringify(session) }));
}
function changeTabVisibility(status) {
    const visibleStates = ["visible", "hidden"];
    if (!visibleStates.includes(status))
        return;
    Object.defineProperty(document, "visibilityState", {
        configurable: true,
        value: status,
    });
    document.dispatchEvent(new Event("visibilitychange"));
}
