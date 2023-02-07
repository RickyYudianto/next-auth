"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DgraphAdapter = exports.format = void 0;
const client_1 = require("./client");
const utils_1 = require("./utils");
Object.defineProperty(exports, "format", { enumerable: true, get: function () { return utils_1.format; } });
const defaultFragments = __importStar(require("./graphql/fragments"));
function DgraphAdapter(client, options) {
    const c = (0, client_1.client)(client);
    const fragments = { ...defaultFragments, ...options === null || options === void 0 ? void 0 : options.fragments };
    return {
        async createUser(input) {
            const result = await c.run(
            /* GraphQL */ `
          mutation ($input: [AddUserInput!]!) {
            addUser(input: $input) {
              user {
                ...UserFragment
              }
            }
          }
          ${fragments.User}
        `, { input });
            return utils_1.format.from(result === null || result === void 0 ? void 0 : result.user[0]);
        },
        async getUser(id) {
            const result = await c.run(
            /* GraphQL */ `
          query ($id: ID!) {
            getUser(id: $id) {
              ...UserFragment
            }
          }
          ${fragments.User}
        `, { id });
            return utils_1.format.from(result);
        },
        async getUserByEmail(email) {
            const [user] = await c.run(
            /* GraphQL */ `
          query ($email: String = "") {
            queryUser(filter: { email: { eq: $email } }) {
              ...UserFragment
            }
          }
          ${fragments.User}
        `, { email });
            return utils_1.format.from(user);
        },
        async getUserByAccount(provider_providerAccountId) {
            const [account] = await c.run(
            /* GraphQL */ `
          query ($providerAccountId: String = "", $provider: String = "") {
            queryAccount(
              filter: {
                and: {
                  providerAccountId: { eq: $providerAccountId }
                  provider: { eq: $provider }
                }
              }
            ) {
              user {
                ...UserFragment
              }
              id
            }
          }
          ${fragments.User}
        `, provider_providerAccountId);
            return utils_1.format.from(account === null || account === void 0 ? void 0 : account.user);
        },
        async updateUser({ id, ...input }) {
            const result = await c.run(
            /* GraphQL */ `
          mutation ($id: [ID!] = "", $input: UserPatch) {
            updateUser(input: { filter: { id: $id }, set: $input }) {
              user {
                ...UserFragment
              }
            }
          }
          ${fragments.User}
        `, { id, input });
            return utils_1.format.from(result.user[0]);
        },
        async deleteUser(id) {
            const result = await c.run(
            /* GraphQL */ `
          mutation ($id: [ID!] = "") {
            deleteUser(filter: { id: $id }) {
              numUids
              user {
                accounts {
                  id
                }
                sessions {
                  id
                }
              }
            }
          }
        `, { id });
            const deletedUser = utils_1.format.from(result.user[0]);
            await c.run(
            /* GraphQL */ `
          mutation ($accounts: [ID!], $sessions: [ID!]) {
            deleteAccount(filter: { id: $accounts }) {
              numUids
            }
            deleteSession(filter: { id: $sessions }) {
              numUids
            }
          }
        `, {
                sessions: deletedUser.sessions.map((x) => x.id),
                accounts: deletedUser.accounts.map((x) => x.id),
            });
            return deletedUser;
        },
        async linkAccount(data) {
            const { userId, ...input } = data;
            await c.run(
            /* GraphQL */ `
          mutation ($input: [AddAccountInput!]!) {
            addAccount(input: $input) {
              account {
                ...AccountFragment
              }
            }
          }
          ${fragments.Account}
        `, { input: { ...input, user: { id: userId } } });
            return data;
        },
        async unlinkAccount(provider_providerAccountId) {
            await c.run(
            /* GraphQL */ `
          mutation ($providerAccountId: String = "", $provider: String = "") {
            deleteAccount(
              filter: {
                and: {
                  providerAccountId: { eq: $providerAccountId }
                  provider: { eq: $provider }
                }
              }
            ) {
              numUids
            }
          }
        `, provider_providerAccountId);
        },
        async getSessionAndUser(sessionToken) {
            const [sessionAndUser] = await c.run(
            /* GraphQL */ `
          query ($sessionToken: String = "") {
            querySession(filter: { sessionToken: { eq: $sessionToken } }) {
              ...SessionFragment
              user {
                ...UserFragment
              }
            }
          }
          ${fragments.User}
          ${fragments.Session}
        `, { sessionToken });
            if (!sessionAndUser)
                return null;
            const { user, ...session } = sessionAndUser;
            return {
                user: utils_1.format.from(user),
                session: { ...utils_1.format.from(session), userId: user.id },
            };
        },
        async createSession(data) {
            const { userId, ...input } = data;
            await c.run(
            /* GraphQL */ `
          mutation ($input: [AddSessionInput!]!) {
            addSession(input: $input) {
              session {
                ...SessionFragment
              }
            }
          }
          ${fragments.Session}
        `, { input: { ...input, user: { id: userId } } });
            return data;
        },
        async updateSession({ sessionToken, ...input }) {
            var _a;
            const result = await c.run(
            /* GraphQL */ `
          mutation ($input: SessionPatch = {}, $sessionToken: String) {
            updateSession(
              input: {
                filter: { sessionToken: { eq: $sessionToken } }
                set: $input
              }
            ) {
              session {
                ...SessionFragment
                user {
                  id
                }
              }
            }
          }
          ${fragments.Session}
        `, { sessionToken, input });
            const session = utils_1.format.from(result.session[0]);
            if (!((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id))
                return null;
            return { ...session, userId: session.user.id };
        },
        async deleteSession(sessionToken) {
            await c.run(
            /* GraphQL */ `
          mutation ($sessionToken: String = "") {
            deleteSession(filter: { sessionToken: { eq: $sessionToken } }) {
              numUids
            }
          }
        `, { sessionToken });
        },
        async createVerificationToken(input) {
            const result = await c.run(
            /* GraphQL */ `
          mutation ($input: [AddVerificationTokenInput!]!) {
            addVerificationToken(input: $input) {
              numUids
            }
          }
        `, { input });
            return utils_1.format.from(result);
        },
        async useVerificationToken(params) {
            const result = await c.run(
            /* GraphQL */ `
          mutation ($token: String = "", $identifier: String = "") {
            deleteVerificationToken(
              filter: {
                and: { token: { eq: $token }, identifier: { eq: $identifier } }
              }
            ) {
              verificationToken {
                ...VerificationTokenFragment
              }
            }
          }
          ${fragments.VerificationToken}
        `, params);
            return utils_1.format.from(result.verificationToken[0]);
        },
    };
}
exports.DgraphAdapter = DgraphAdapter;
