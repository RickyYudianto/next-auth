import { Profile } from "../types.js";
import CredentialsProvider from "./credentials.js";
import type { CredentialsConfig, CredentialsProviderType } from "./credentials.js";
import type { Email as EmailProvider, EmailConfig, EmailProviderType } from "./email.js";
import type { OAuth2Config, OAuthConfig, OAuthProviderType, OIDCConfig } from "./oauth.js";
export * from "./credentials.js";
export * from "./email.js";
export * from "./oauth.js";
/**
 * Providers passed to Auth.js must define one of these types.
 *
 * @see [RFC 6749 - The OAuth 2.0 Authorization Framework](https://www.rfc-editor.org/rfc/rfc6749.html#section-2.3)
 * @see [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication)
 * @see [Email or Passwordless Authentication](https://authjs.dev/concepts/oauth)
 * @see [Credentials-based Authentication](https://authjs.dev/concepts/credentials)
 */
export type ProviderType = "oidc" | "oauth" | "email" | "credentials";
/** Shared across all {@link ProviderType} */
export interface CommonProviderOptions {
    /**
     * Uniquely identifies the provider in {@link AuthConfig.providers}
     * It's also part of the URL
     */
    id: string;
    /**
     * The provider name used on the default sign-in page's sign-in button.
     * For example if it's "Google", the corresponding button will say:
     * "Sign in with Google"
     */
    name: string;
    /** See {@link ProviderType} */
    type: ProviderType;
}
/**
 * Must be a supported authentication provider config:
 * - {@link OAuthConfig}
 * - {@link EmailConfigInternal}
 * - {@link CredentialsConfigInternal}
 *
 * For more information, see the guides:
 *
 * @see [OAuth/OIDC guide](https://authjs.dev/guides/providers/custom-provider)
 * @see [Email (Passwordless) guide](https://authjs.dev/guides/providers/email)
 * @see [Credentials guide](https://authjs.dev/guides/providers/credentials)
 */
export type Provider<P extends Profile = Profile> = (OIDCConfig<P> | OAuth2Config<P> | EmailConfig | CredentialsConfig) & {};
export type BuiltInProviders = Record<OAuthProviderType, (config: Partial<OAuthConfig<any>>) => OAuthConfig<any>> & Record<CredentialsProviderType, typeof CredentialsProvider> & Record<EmailProviderType, typeof EmailProvider>;
export type AppProviders = Array<Provider | ReturnType<BuiltInProviders[keyof BuiltInProviders]>>;
export interface AppProvider extends CommonProviderOptions {
    signinUrl: string;
    callbackUrl: string;
}
export type RedirectableProviderType = "email" | "credentials";
export type BuiltInProviderType = RedirectableProviderType | OAuthProviderType;
//# sourceMappingURL=index.d.ts.map