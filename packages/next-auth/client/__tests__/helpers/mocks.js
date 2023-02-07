"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.mockSignOutResponse = exports.mockEmailResponse = exports.mockCredentialsResponse = exports.mockGithubResponse = exports.mockCSRFToken = exports.mockProviders = exports.mockSession = void 0;
const node_1 = require("msw/node");
const msw_1 = require("msw");
const crypto_1 = require("crypto");
exports.mockSession = {
    ok: true,
    user: {
        image: null,
        name: "John",
        email: "john@email.com",
    },
    expires: 123213139,
};
exports.mockProviders = {
    ok: true,
    github: {
        id: "github",
        name: "Github",
        type: "oauth",
        signinUrl: "path/to/signin",
        callbackUrl: "path/to/callback",
    },
    credentials: {
        id: "credentials",
        name: "Credentials",
        type: "credentials",
        authorize: null,
        credentials: null,
    },
    email: {
        id: "email",
        type: "email",
        name: "Email",
    },
};
exports.mockCSRFToken = {
    ok: true,
    csrfToken: (0, crypto_1.randomBytes)(32).toString("hex"),
};
exports.mockGithubResponse = {
    ok: true,
    status: 200,
    url: "https://path/to/github/url",
};
exports.mockCredentialsResponse = {
    ok: true,
    status: 200,
    url: "https://path/to/credentials/url",
};
exports.mockEmailResponse = {
    ok: true,
    status: 200,
    url: "https://path/to/email/url",
};
exports.mockSignOutResponse = {
    ok: true,
    status: 200,
    url: "https://path/to/signout/url",
};
exports.server = (0, node_1.setupServer)(msw_1.rest.post("*/api/auth/signout", (req, res, ctx) => res(ctx.status(200), ctx.json(exports.mockSignOutResponse))), msw_1.rest.get("*/api/auth/session", (req, res, ctx) => res(ctx.status(200), ctx.json(exports.mockSession))), msw_1.rest.get("*/api/auth/csrf", (req, res, ctx) => res(ctx.status(200), ctx.json(exports.mockCSRFToken))), msw_1.rest.get("*/api/auth/providers", (req, res, ctx) => res(ctx.status(200), ctx.json(exports.mockProviders))), msw_1.rest.post("*/api/auth/signin/github", (req, res, ctx) => res(ctx.status(200), ctx.json(exports.mockGithubResponse))), msw_1.rest.post("*/api/auth/callback/credentials", (req, res, ctx) => res(ctx.status(200), ctx.json(exports.mockCredentialsResponse))), msw_1.rest.post("*/api/auth/signin/email", (req, res, ctx) => res(ctx.status(200), ctx.json(exports.mockEmailResponse))), msw_1.rest.post("*/api/auth/_log", (req, res, ctx) => res(ctx.status(200))));
