"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XataAdapter = void 0;
function XataAdapter(client) {
    return {
        async createUser(user) {
            const newUser = await client.db.nextauth_users.create(user);
            return newUser;
        },
        async getUser(id) {
            const user = await client.db.nextauth_users.filter({ id }).getFirst();
            return user !== null && user !== void 0 ? user : null;
        },
        async getUserByEmail(email) {
            const user = await client.db.nextauth_users.filter({ email }).getFirst();
            return user !== null && user !== void 0 ? user : null;
        },
        async getUserByAccount({ providerAccountId, provider }) {
            const result = await client.db.nextauth_users_accounts
                .select(["user.*"])
                .filter({
                "account.providerAccountId": providerAccountId,
                "account.provider": provider,
            })
                .getFirst();
            const user = result === null || result === void 0 ? void 0 : result.user;
            return user !== null && user !== void 0 ? user : null;
        },
        async updateUser(user) {
            var _a;
            const result = await client.db.nextauth_users.update(user.id, user);
            return (result !== null && result !== void 0 ? result : {
                ...user,
                id: user.id,
                emailVerified: (_a = user.emailVerified) !== null && _a !== void 0 ? _a : null,
            });
        },
        async deleteUser(id) {
            return await client.db.nextauth_users.delete(id);
        },
        async linkAccount(initialAccount) {
            const { userId, ...account } = initialAccount;
            const newXataAccount = await client.db.nextauth_accounts.create({
                ...account,
                user: { id: userId },
            });
            await client.db.nextauth_users_accounts.create({
                user: { id: userId },
                account: { id: newXataAccount.id },
            });
        },
        async unlinkAccount({ providerAccountId, provider }) {
            /**
             * @todo refactor this when we support DELETE WHERE.
             */
            const connectedAccount = await client.db.nextauth_users_accounts
                .filter({
                "account.providerAccountId": providerAccountId,
                "account.provider": provider,
            })
                .getFirst();
            if (!connectedAccount) {
                return;
            }
            return await client.db.nextauth_users_accounts.delete(connectedAccount.id);
        },
        async createSession(initialSession) {
            const { userId, ...session } = initialSession;
            const newXataSession = await client.db.nextauth_sessions.create({
                ...session,
                user: { id: userId },
            });
            await client.db.nextauth_users_sessions.create({
                user: { id: userId },
                session: { id: newXataSession.id },
            });
            return { ...session, ...newXataSession, userId };
        },
        async getSessionAndUser(sessionToken) {
            var _a;
            const result = await client.db.nextauth_users_sessions
                .select(["user.*", "session.*"])
                .filter({ "session.sessionToken": sessionToken })
                .getFirst();
            if (!(result === null || result === void 0 ? void 0 : result.session) || !(result === null || result === void 0 ? void 0 : result.user)) {
                return null;
            }
            return {
                session: {
                    ...result.session,
                    sessionToken: result.session.sessionToken,
                    expires: result.session.expires,
                    userId: result.user.id,
                },
                user: {
                    ...result.user,
                    emailVerified: (_a = result.user.emailVerified) !== null && _a !== void 0 ? _a : null,
                },
            };
        },
        async updateSession({ sessionToken, ...data }) {
            const session = await client.db.nextauth_sessions
                .filter({ sessionToken })
                .getFirst();
            if (!session) {
                return null;
            }
            await client.db.nextauth_sessions.update({ ...session, ...data });
            return {
                ...session,
                sessionToken,
                userId: data.userId,
                expires: data.expires,
            };
        },
        async deleteSession(sessionToken) {
            /**
             * @todo refactor this when we support DELETE WHERE.
             */
            const session = await client.db.nextauth_sessions
                .filter({ sessionToken })
                .getFirst();
            if (!session) {
                return;
            }
            const connectedSession = await client.db.nextauth_users_sessions
                .filter({ "session.sessionToken": sessionToken })
                .getFirst();
            if (!connectedSession) {
                return;
            }
            await client.db.nextauth_sessions.delete(session.id);
            await client.db.nextauth_users_sessions.delete(connectedSession.id);
        },
        async createVerificationToken(token) {
            await client.db.nextauth_verificationTokens.create({
                expires: token.expires,
                identifier: token.identifier,
                token: token.token,
            });
            return token;
        },
        async useVerificationToken(token) {
            /**
             * @todo refactor this when we support DELETE WHERE.
             */
            const xataToken = await client.db.nextauth_verificationTokens
                .filter({ identifier: token.identifier, token: token.token })
                .getFirst();
            if (!xataToken) {
                return null;
            }
            await client.db.nextauth_verificationTokens.delete(xataToken.id);
            return { ...token, expires: new Date() };
        },
    };
}
exports.XataAdapter = XataAdapter;
