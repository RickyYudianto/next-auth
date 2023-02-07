import type { InternalOptions, RequestInternal, CookiesOptions } from "../../types.js";
import type { Cookie } from "../cookie.js";
/** Returns a signed cookie. */
export declare function signCookie(type: keyof CookiesOptions, value: string, maxAge: number, options: InternalOptions<"oauth">): Promise<Cookie>;
export declare const pkce: {
    create(options: InternalOptions<"oauth">): Promise<{
        cookie: Cookie;
        value: string;
    }>;
    /**
     * Returns code_verifier if provider uses PKCE,
     * and clears the container cookie afterwards.
     */
    use(codeVerifier: string | undefined, options: InternalOptions<"oauth">): Promise<{
        codeVerifier: string;
        cookie: Cookie;
    } | undefined>;
};
export declare const state: {
    create(options: InternalOptions<"oauth">): Promise<{
        cookie: Cookie;
        value: string;
    } | undefined>;
    /**
     * Returns state from the saved cookie
     * if the provider supports states,
     * and clears the container cookie afterwards.
     */
    use(cookies: RequestInternal["cookies"], resCookies: Cookie[], options: InternalOptions<"oauth">): Promise<string | undefined>;
};
export declare const nonce: {
    create(options: InternalOptions<"oauth">): Promise<{
        cookie: Cookie;
        value: string;
    } | undefined>;
    /**
     * Returns nonce from if the provider supports nonce,
     * and clears the container cookie afterwards.
     */
    use(nonce: string | undefined, options: InternalOptions<"oauth">): Promise<{
        value: string;
        cookie: Cookie;
    } | undefined>;
};
//# sourceMappingURL=checks.d.ts.map