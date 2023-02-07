"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
const react_2 = require("@testing-library/react");
const logger_1 = __importDefault(require("../../utils/logger"));
const mocks_1 = require("./helpers/mocks");
const react_3 = require("../../react");
const msw_1 = require("msw");
const { location } = window;
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
    let _href = window.location.href;
    // Allows to mutate `window.location`...
    delete window.location;
    window.location = {
        reload: jest.fn(),
    };
    Object.defineProperty(window.location, "href", {
        get: () => _href,
        // whatwg-fetch or whatwg-url does not seem to work with relative URLs
        set: (href) => {
            _href = href.startsWith("/") ? `http://localhost${href}` : href;
            return _href;
        },
    });
});
beforeEach(() => {
    jest.clearAllMocks();
    mocks_1.server.resetHandlers();
});
afterAll(() => {
    window.location = location;
    mocks_1.server.close();
});
const callbackUrl = "https://redirects/to";
test.each `
  provider | type
  ${""}    | ${"no"}
  ${"foo"} | ${"unknown"}
`("if $type provider, it redirects to the default sign-in page", async ({ provider }) => {
    (0, react_2.render)((0, jsx_runtime_1.jsx)(SignInFlow, { providerId: provider, callbackUrl: callbackUrl }));
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        expect(window.location.href).toBe(`http://localhost/api/auth/signin?${new URLSearchParams({
            callbackUrl,
        })}`);
    });
});
test.each `
  provider | type
  ${""}    | ${"no"}
  ${"foo"} | ${"unknown"}
`("if $type provider supplied and no callback URL, redirects using the current location", async ({ provider }) => {
    (0, react_2.render)((0, jsx_runtime_1.jsx)(SignInFlow, { providerId: provider }));
    const callbackUrl = window.location.href;
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        expect(window.location.href).toBe(`http://localhost/api/auth/signin?${new URLSearchParams({
            callbackUrl,
        })}`);
    });
});
test.each `
  provider         | mockUrl
  ${`email`}       | ${mocks_1.mockEmailResponse.url}
  ${`credentials`} | ${mocks_1.mockCredentialsResponse.url}
`("$provider provider redirects if `redirect` is `true`", async ({ provider, mockUrl }) => {
    (0, react_2.render)((0, jsx_runtime_1.jsx)(SignInFlow, { providerId: provider, redirect: true }));
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        expect(window.location.href).toBe(mockUrl);
    });
});
test("redirection can't be stopped using an oauth provider", async () => {
    (0, react_2.render)((0, jsx_runtime_1.jsx)(SignInFlow, { providerId: "github", callbackUrl: callbackUrl, redirect: false }));
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        expect(window.location.href).toBe(mocks_1.mockGithubResponse.url);
    });
});
test("redirection can be stopped using the 'credentials' provider", async () => {
    (0, react_2.render)((0, jsx_runtime_1.jsx)(SignInFlow, { providerId: "credentials", callbackUrl: callbackUrl, redirect: false }));
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        expect(window.location.href).not.toBe(mocks_1.mockCredentialsResponse.url);
        expect(react_2.screen.getByTestId("signin-result").textContent).not.toBe("no response");
    });
    // snapshot the expected return shape from `signIn`
    expect(JSON.parse(react_2.screen.getByTestId("signin-result").textContent))
        .toMatchInlineSnapshot(`
    Object {
      "error": null,
      "ok": true,
      "status": 200,
      "url": "https://path/to/credentials/url",
    }
  `);
});
test("redirection can be stopped using the 'email' provider", async () => {
    (0, react_2.render)((0, jsx_runtime_1.jsx)(SignInFlow, { providerId: "email", callbackUrl: callbackUrl, redirect: false }));
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        expect(window.location.href).not.toBe(mocks_1.mockEmailResponse.url);
        expect(react_2.screen.getByTestId("signin-result").textContent).not.toBe("no response");
    });
    // snapshot the expected return shape from `signIn` oauth
    expect(JSON.parse(react_2.screen.getByTestId("signin-result").textContent))
        .toMatchInlineSnapshot(`
    Object {
      "error": null,
      "ok": true,
      "status": 200,
      "url": "https://path/to/email/url",
    }
  `);
});
test("if callback URL contains a hash we force a window reload when re-directing", async () => {
    const mockUrlWithHash = "https://path/to/email/url#foo-bar-baz";
    mocks_1.server.use(msw_1.rest.post("*/api/auth/signin/email", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({
            ...mocks_1.mockEmailResponse,
            url: mockUrlWithHash,
        }));
    }));
    (0, react_2.render)((0, jsx_runtime_1.jsx)(SignInFlow, { providerId: "email", callbackUrl: mockUrlWithHash }));
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        expect(window.location.href).toBe(mockUrlWithHash);
        // the browser will not refresh the page if the redirect URL contains a hash, hence we force it on the client, see #1289
        expect(window.location.reload).toHaveBeenCalledTimes(1);
    });
});
test("params are propagated to the signin URL when supplied", async () => {
    let matchedParams = "";
    const authParams = "foo=bar&bar=foo";
    mocks_1.server.use(msw_1.rest.post("*/auth/signin/github", (req, res, ctx) => {
        matchedParams = req.url.search;
        return res(ctx.status(200), ctx.json(mocks_1.mockGithubResponse));
    }));
    (0, react_2.render)((0, jsx_runtime_1.jsx)(SignInFlow, { providerId: "github", authorizationParams: authParams }));
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        expect(matchedParams).toEqual(`?${authParams}`);
    });
});
test("when it fails to fetch the providers, it redirected back to signin page", async () => {
    const errorMsg = "Error when retrieving providers";
    mocks_1.server.use(msw_1.rest.get("*/api/auth/providers", (req, res, ctx) => res(ctx.status(500), ctx.json(errorMsg))));
    (0, react_2.render)((0, jsx_runtime_1.jsx)(SignInFlow, { providerId: "github" }));
    user_event_1.default.click(react_2.screen.getByRole("button"));
    await (0, react_2.waitFor)(() => {
        expect(window.location.href).toBe(`http://localhost/api/auth/error`);
        expect(logger_1.default.error).toHaveBeenCalledTimes(1);
        expect(logger_1.default.error).toBeCalledWith("CLIENT_FETCH_ERROR", {
            error: "Error when retrieving providers",
            url: "/api/auth/providers",
        });
    });
});
function SignInFlow({ providerId, callbackUrl, redirect = true, authorizationParams = {}, }) {
    const [response, setResponse] = (0, react_1.useState)(null);
    async function handleSignIn() {
        const result = await (0, react_3.signIn)(providerId, { callbackUrl, redirect }, authorizationParams);
        setResponse(result);
    }
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { "data-testid": "signin-result", children: response ? JSON.stringify(response) : "no response" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSignIn, children: "Sign in" })] }));
}
