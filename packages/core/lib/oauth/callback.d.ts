import type { InternalOptions, Profile, RequestInternal } from "../../types.js";
import type { Cookie } from "../cookie.js";
/**
 * Handles the following OAuth steps.
 * https://www.rfc-editor.org/rfc/rfc6749#section-4.1.1
 * https://www.rfc-editor.org/rfc/rfc6749#section-4.1.3
 * https://openid.net/specs/openid-connect-core-1_0.html#UserInfoRequest
 *
 * @note Although requesting userinfo is not required by the OAuth2.0 spec,
 * we fetch it anyway. This is because we always want a user profile.
 */
export declare function handleOAuth(query: RequestInternal["query"], cookies: RequestInternal["cookies"], options: InternalOptions<"oauth">): Promise<{
    cookies: Cookie[];
    profile?: import("../../types.js").User | undefined;
    account?: {
        access_token?: string | undefined;
        expires_in?: number | undefined;
        id_token?: undefined;
        refresh_token?: string | undefined;
        scope?: string | undefined;
        token_type?: string | undefined;
        provider: string;
        type: "oidc" | "oauth";
        providerAccountId: string;
    } | {
        access_token?: string | undefined;
        expires_in?: number | undefined;
        id_token?: string | undefined;
        refresh_token?: string | undefined;
        scope?: string | undefined;
        token_type?: string | undefined;
        provider: string;
        type: "oidc" | "oauth";
        providerAccountId: string;
    } | undefined;
    OAuthProfile?: Profile | undefined;
}>;
//# sourceMappingURL=callback.d.ts.map