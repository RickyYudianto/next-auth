import type { AuthConfig, RequestInternal, ResponseInternal } from "../types.js";
export declare function AuthInternal<Body extends string | Record<string, any> | any[]>(request: RequestInternal, authOptions: AuthConfig): Promise<ResponseInternal<Body>>;
/**
 * :::danger
 * This option is intended for framework authors.
 * :::
 *
 * Auth.js comes with built-in {@link https://authjs.dev/concepts/security#csrf CSRF} protection, but
 * if you are implementing a framework that is already protected against CSRF attacks, you can skip this check by
 * passing this value to {@link AuthConfig.skipCSRFCheck}.
 */
export declare const skipCSRFCheck: unique symbol;
//# sourceMappingURL=index.d.ts.map