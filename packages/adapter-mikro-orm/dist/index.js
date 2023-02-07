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
exports.MikroOrmAdapter = exports.defaultEntities = void 0;
const core_1 = require("@mikro-orm/core");
const defaultEntities = __importStar(require("./entities"));
exports.defaultEntities = defaultEntities;
/**
 * The MikroORM adapter accepts a MikroORM configuration and returns a NextAuth adapter.
 * @param ormConnection a MikroORM connection configuration (https://mikro-orm.io/docs/next/configuration#driver)
 * @param options entities in the options object will be passed to the MikroORM init function as entities. Has to be provided if overridden!
 * @returns
 */
function MikroOrmAdapter(ormOptions, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const UserModel = (_b = (_a = options === null || options === void 0 ? void 0 : options.entities) === null || _a === void 0 ? void 0 : _a.User) !== null && _b !== void 0 ? _b : defaultEntities.User;
    const AccountModel = (_d = (_c = options === null || options === void 0 ? void 0 : options.entities) === null || _c === void 0 ? void 0 : _c.Account) !== null && _d !== void 0 ? _d : defaultEntities.Account;
    const SessionModel = (_f = (_e = options === null || options === void 0 ? void 0 : options.entities) === null || _e === void 0 ? void 0 : _e.Session) !== null && _f !== void 0 ? _f : defaultEntities.Session;
    const VerificationTokenModel = (_h = (_g = options === null || options === void 0 ? void 0 : options.entities) === null || _g === void 0 ? void 0 : _g.VerificationToken) !== null && _h !== void 0 ? _h : defaultEntities.VerificationToken;
    let _orm;
    const getEM = async () => {
        var _a, _b;
        if (!_orm) {
            // filter out default entities from the passed entities
            const optionsEntities = (_b = (_a = ormOptions.entities) === null || _a === void 0 ? void 0 : _a.filter((e) => {
                if (typeof e !== "string" &&
                    "name" in e &&
                    typeof e.name === "string")
                    return ![
                        "User",
                        "Account",
                        "Session",
                        "VerificationToken",
                    ].includes(e.name);
                return true;
            })) !== null && _b !== void 0 ? _b : [];
            // add the (un-)enhanced entities to the connection
            ormOptions.entities = [
                ...optionsEntities,
                UserModel,
                AccountModel,
                SessionModel,
                VerificationTokenModel,
            ];
            _orm = await core_1.MikroORM.init(ormOptions);
        }
        return _orm.em.fork();
    };
    return {
        /**
         * Method used in testing. You won't need to call this in your app.
         * @internal
         */
        // @ts-expect-error
        async __disconnect() {
            const em = await getEM();
            await em.getConnection().close();
        },
        async createUser(data) {
            const em = await getEM();
            const user = new UserModel();
            (0, core_1.wrap)(user).assign(data);
            await em.persistAndFlush(user);
            return (0, core_1.wrap)(user).toObject();
        },
        async getUser(id) {
            const em = await getEM();
            const user = await em.findOne(UserModel, { id });
            if (!user)
                return null;
            return (0, core_1.wrap)(user).toObject();
        },
        async getUserByEmail(email) {
            const em = await getEM();
            const user = await em.findOne(UserModel, { email });
            if (!user)
                return null;
            return (0, core_1.wrap)(user).toObject();
        },
        async getUserByAccount(provider_providerAccountId) {
            const em = await getEM();
            const account = await em.findOne(AccountModel, {
                ...provider_providerAccountId,
            });
            if (!account)
                return null;
            const user = await em.findOne(UserModel, { id: account.userId });
            return (0, core_1.wrap)(user).toObject();
        },
        async updateUser(data) {
            const em = await getEM();
            const user = await em.findOne(UserModel, { id: data.id });
            if (!user)
                throw new Error("User not found");
            (0, core_1.wrap)(user).assign(data, { mergeObjects: true });
            await em.persistAndFlush(user);
            return (0, core_1.wrap)(user).toObject();
        },
        async deleteUser(id) {
            const em = await getEM();
            const user = await em.findOne(UserModel, { id });
            if (!user)
                return null;
            await em.removeAndFlush(user);
            return (0, core_1.wrap)(user).toObject();
        },
        async linkAccount(data) {
            const em = await getEM();
            const user = await em.findOne(UserModel, { id: data.userId });
            if (!user)
                throw new Error("User not found");
            const account = new AccountModel();
            (0, core_1.wrap)(account).assign(data);
            user.accounts.add(account);
            await em.persistAndFlush(user);
            return (0, core_1.wrap)(account).toObject();
        },
        async unlinkAccount(provider_providerAccountId) {
            const em = await getEM();
            const account = await em.findOne(AccountModel, {
                ...provider_providerAccountId,
            });
            if (!account)
                throw new Error("Account not found");
            await em.removeAndFlush(account);
            return (0, core_1.wrap)(account).toObject();
        },
        async getSessionAndUser(sessionToken) {
            const em = await getEM();
            const session = await em.findOne(SessionModel, { sessionToken }, { populate: ["user"] });
            if (!session || !session.user)
                return null;
            return {
                user: (0, core_1.wrap)(session.user).toObject(),
                session: (0, core_1.wrap)(session).toObject(),
            };
        },
        async createSession(data) {
            const em = await getEM();
            const user = await em.findOne(UserModel, { id: data.userId });
            if (!user)
                throw new Error("User not found");
            const session = new SessionModel();
            (0, core_1.wrap)(session).assign(data);
            user.sessions.add(session);
            await em.persistAndFlush(user);
            return (0, core_1.wrap)(session).toObject();
        },
        async updateSession(data) {
            const em = await getEM();
            const session = await em.findOne(SessionModel, {
                sessionToken: data.sessionToken,
            });
            (0, core_1.wrap)(session).assign(data);
            if (!session)
                throw new Error("Session not found");
            await em.persistAndFlush(session);
            return (0, core_1.wrap)(session).toObject();
        },
        async deleteSession(sessionToken) {
            const em = await getEM();
            const session = await em.findOne(SessionModel, {
                sessionToken,
            });
            if (!session)
                return null;
            await em.removeAndFlush(session);
            return (0, core_1.wrap)(session).toObject();
        },
        async createVerificationToken(data) {
            const em = await getEM();
            const verificationToken = new VerificationTokenModel();
            (0, core_1.wrap)(verificationToken).assign(data);
            await em.persistAndFlush(verificationToken);
            return (0, core_1.wrap)(verificationToken).toObject();
        },
        async useVerificationToken(params) {
            const em = await getEM();
            const verificationToken = await em
                .getRepository(VerificationTokenModel)
                .findOne(params);
            if (!verificationToken)
                return null;
            await em.removeAndFlush(verificationToken);
            return (0, core_1.wrap)(verificationToken).toObject();
        },
    };
}
exports.MikroOrmAdapter = MikroOrmAdapter;
