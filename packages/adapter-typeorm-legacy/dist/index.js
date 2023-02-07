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
exports.TypeORMLegacyAdapter = exports.getManager = exports.entities = void 0;
const typeorm_1 = require("typeorm");
const defaultEntities = __importStar(require("./entities"));
const utils_1 = require("./utils");
exports.entities = defaultEntities;
let _dataSource;
async function getManager(options) {
    const { dataSource, entities } = options;
    const config = {
        ...(0, utils_1.parseDataSourceConfig)(dataSource),
        entities: Object.values(entities),
    };
    if (!_dataSource)
        _dataSource = new typeorm_1.DataSource(config);
    const manager = _dataSource === null || _dataSource === void 0 ? void 0 : _dataSource.manager;
    if (!manager.connection.isInitialized) {
        await manager.connection.initialize();
    }
    if (process.env.NODE_ENV !== "production") {
        await (0, utils_1.updateConnectionEntities)(_dataSource, config.entities);
    }
    return manager;
}
exports.getManager = getManager;
function TypeORMLegacyAdapter(dataSource, options) {
    var _a, _b, _c, _d;
    const entities = options === null || options === void 0 ? void 0 : options.entities;
    const c = {
        dataSource,
        entities: {
            UserEntity: (_a = entities === null || entities === void 0 ? void 0 : entities.UserEntity) !== null && _a !== void 0 ? _a : defaultEntities.UserEntity,
            SessionEntity: (_b = entities === null || entities === void 0 ? void 0 : entities.SessionEntity) !== null && _b !== void 0 ? _b : defaultEntities.SessionEntity,
            AccountEntity: (_c = entities === null || entities === void 0 ? void 0 : entities.AccountEntity) !== null && _c !== void 0 ? _c : defaultEntities.AccountEntity,
            VerificationTokenEntity: (_d = entities === null || entities === void 0 ? void 0 : entities.VerificationTokenEntity) !== null && _d !== void 0 ? _d : defaultEntities.VerificationTokenEntity,
        },
    };
    return {
        /**
         * Method used in testing. You won't need to call this in your app.
         * @internal
         */
        async __disconnect() {
            const m = await getManager(c);
            await m.connection.close();
        },
        // @ts-expect-error
        createUser: async (data) => {
            const m = await getManager(c);
            const user = await m.save("UserEntity", data);
            return user;
        },
        // @ts-expect-error
        async getUser(id) {
            const m = await getManager(c);
            const user = await m.findOne("UserEntity", { where: { id } });
            if (!user)
                return null;
            return { ...user };
        },
        // @ts-expect-error
        async getUserByEmail(email) {
            const m = await getManager(c);
            const user = await m.findOne("UserEntity", { where: { email } });
            if (!user)
                return null;
            return { ...user };
        },
        async getUserByAccount(provider_providerAccountId) {
            var _a;
            const m = await getManager(c);
            const account = await m.findOne("AccountEntity", { where: provider_providerAccountId, relations: ["user"] });
            if (!account)
                return null;
            return (_a = account.user) !== null && _a !== void 0 ? _a : null;
        },
        // @ts-expect-error
        async updateUser(data) {
            const m = await getManager(c);
            const user = await m.save("UserEntity", data);
            return user;
        },
        async deleteUser(id) {
            const m = await getManager(c);
            await m.transaction(async (tm) => {
                await tm.delete("AccountEntity", { userId: id });
                await tm.delete("SessionEntity", { userId: id });
                await tm.delete("UserEntity", { id });
            });
        },
        async linkAccount(data) {
            const m = await getManager(c);
            const account = await m.save("AccountEntity", data);
            return account;
        },
        async unlinkAccount(providerAccountId) {
            const m = await getManager(c);
            await m.delete("AccountEntity", providerAccountId);
        },
        async createSession(data) {
            const m = await getManager(c);
            const session = await m.save("SessionEntity", data);
            return session;
        },
        async getSessionAndUser(sessionToken) {
            const m = await getManager(c);
            const sessionAndUser = await m.findOne("SessionEntity", { where: { sessionToken }, relations: ["user"] });
            if (!sessionAndUser)
                return null;
            const { user, ...session } = sessionAndUser;
            return { session, user };
        },
        async updateSession(data) {
            const m = await getManager(c);
            await m.update("SessionEntity", { sessionToken: data.sessionToken }, data);
            // TODO: Try to return?
            return null;
        },
        async deleteSession(sessionToken) {
            const m = await getManager(c);
            await m.delete("SessionEntity", { sessionToken });
        },
        async createVerificationToken(data) {
            const m = await getManager(c);
            const verificationToken = await m.save("VerificationTokenEntity", data);
            // @ts-expect-error
            delete verificationToken.id;
            return verificationToken;
        },
        // @ts-expect-error
        async useVerificationToken(identifier_token) {
            const m = await getManager(c);
            const verificationToken = await m.findOne("VerificationTokenEntity", {
                where: identifier_token,
            });
            if (!verificationToken) {
                return null;
            }
            await m.delete("VerificationTokenEntity", identifier_token);
            // @ts-expect-error
            delete verificationToken.id;
            return verificationToken;
        },
    };
}
exports.TypeORMLegacyAdapter = TypeORMLegacyAdapter;
