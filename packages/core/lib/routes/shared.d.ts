import { InternalOptions } from "../../types.js";
import type { Adapter, AdapterUser } from "../../adapters.js";
export declare function handleAuthorized(params: any, { url, logger, callbacks: { signIn } }: InternalOptions): Promise<{
    status: 403;
    redirect: string;
} | {
    status: 500;
    redirect: string;
} | undefined>;
/**
 * Query the database for a user by email address.
 * If it's an existing user, return a user object,
 * otherwise use placeholder.
 */
export declare function getAdapterUserFromEmail(email: string, adapter: Adapter): Promise<AdapterUser>;
//# sourceMappingURL=shared.d.ts.map