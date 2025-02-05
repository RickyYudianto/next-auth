import type { InternalOptions, RequestInternal, ResponseInternal } from "../../types.js";
/**
 * Initiates the sign in process for OAuth and Email flows .
 * For OAuth, redirects to the provider's authorization URL.
 * For Email, sends an email with a sign in link.
 */
export declare function signin(query: RequestInternal["query"], body: RequestInternal["body"], options: InternalOptions<"oauth" | "email">): Promise<ResponseInternal>;
//# sourceMappingURL=signin.d.ts.map