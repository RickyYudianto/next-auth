import type { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from "next-auth/adapters";
import { Sequelize, Model, ModelCtor } from "sequelize";
import * as defaultModels from "./models";
export { defaultModels as models };
interface AccountInstance extends Model<AdapterAccount, Partial<AdapterAccount>>, AdapterAccount {
}
interface UserInstance extends Model<AdapterUser, Partial<AdapterUser>>, AdapterUser {
}
interface SessionInstance extends Model<AdapterSession, Partial<AdapterSession>>, AdapterSession {
}
interface VerificationTokenInstance extends Model<VerificationToken, Partial<VerificationToken>>, VerificationToken {
}
interface SequelizeAdapterOptions {
    synchronize?: boolean;
    models?: Partial<{
        User: ModelCtor<UserInstance>;
        Account: ModelCtor<AccountInstance>;
        Session: ModelCtor<SessionInstance>;
        VerificationToken: ModelCtor<VerificationTokenInstance>;
    }>;
}
export default function SequelizeAdapter(client: Sequelize, options?: SequelizeAdapterOptions): Adapter;
