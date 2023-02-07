import { Client as FaunaClient, ExprArg } from "faunadb";
import { Adapter } from "next-auth/adapters";
export declare const collections: {
    readonly Users: import("faunadb").Expr;
    readonly Accounts: import("faunadb").Expr;
    readonly Sessions: import("faunadb").Expr;
    readonly VerificationTokens: import("faunadb").Expr;
};
export declare const indexes: {
    readonly AccountByProviderAndProviderAccountId: import("faunadb").Expr;
    readonly UserByEmail: import("faunadb").Expr;
    readonly SessionByToken: import("faunadb").Expr;
    readonly VerificationTokenByIdentifierAndToken: import("faunadb").Expr;
    readonly SessionsByUser: import("faunadb").Expr;
    readonly AccountsByUser: import("faunadb").Expr;
};
export declare const format: {
    /** Takes a plain old JavaScript object and turns it into a Fauna object */
    to(object: Record<string, any>): Record<string, unknown>;
    /** Takes a Fauna object and returns a plain old JavaScript object */
    from<T = Record<string, unknown>>(object: Record<string, any>): T;
};
/**
 * Fauna throws an error when something is not found in the db,
 * `next-auth` expects `null` to be returned
 */
export declare function query(f: FaunaClient, format: (...args: any) => any): <T>(expr: ExprArg) => Promise<T | null>;
export declare function FaunaAdapter(f: FaunaClient): Adapter;
