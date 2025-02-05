import { jsx as _jsx, jsxs as _jsxs } from "preact/jsx-runtime";
const signinErrors = {
    default: "Unable to sign in.",
    signin: "Try signing in with a different account.",
    oauthsignin: "Try signing in with a different account.",
    oauthcallback: "Try signing in with a different account.",
    oauthcreateaccount: "Try signing in with a different account.",
    emailcreateaccount: "Try signing in with a different account.",
    callback: "Try signing in with a different account.",
    oauthaccountnotlinked: "To confirm your identity, sign in with the same account you used originally.",
    emailsignin: "The e-mail could not be sent.",
    credentialssignin: "Sign in failed. Check the details you provided are correct.",
    sessionrequired: "Please sign in to access this page.",
};
export default function SigninPage(props) {
    const { csrfToken, providers = [], callbackUrl, theme, email, error: errorType, } = props;
    if (typeof document !== "undefined" && theme.brandColor) {
        document.documentElement.style.setProperty("--brand-color", theme.brandColor);
    }
    if (typeof document !== "undefined" && theme.buttonText) {
        document.documentElement.style.setProperty("--button-text-color", theme.buttonText);
    }
    const error = errorType &&
        (signinErrors[errorType.toLowerCase()] ??
            signinErrors.default);
    const logos = "https://authjs.dev/img/providers";
    return (_jsxs("div", { className: "signin", children: [theme.brandColor && (_jsx("style", { dangerouslySetInnerHTML: {
                    __html: `:root {--brand-color: ${theme.brandColor}}`,
                } })), theme.buttonText && (_jsx("style", { dangerouslySetInnerHTML: {
                    __html: `
        :root {
          --button-text-color: ${theme.buttonText}
        }
      `,
                } })), _jsxs("div", { className: "card", children: [error && (_jsx("div", { className: "error", children: _jsx("p", { children: error }) })), providers.map((provider, i) => (_jsxs("div", { className: "provider", children: [provider.type === "oauth" || provider.type === "oidc" ? (_jsxs("form", { action: provider.signinUrl, method: "POST", children: [_jsx("input", { type: "hidden", name: "csrfToken", value: csrfToken }), callbackUrl && (_jsx("input", { type: "hidden", name: "callbackUrl", value: callbackUrl })), _jsxs("button", { type: "submit", className: "button", style: {
                                            "--provider-bg": provider.style?.bg ?? "",
                                            "--provider-dark-bg": provider.style?.bgDark ?? "",
                                            "--provider-color": provider.style?.text ?? "",
                                            "--provider-dark-color": provider.style?.textDark ?? "",
                                            gap: 8,
                                        }, children: [provider.style?.logo && (_jsx("img", { loading: "lazy", height: 24, width: 24, id: "provider-logo", src: `${provider.style.logo.startsWith("/") ? logos : ""}${provider.style.logo}` })), provider.style?.logoDark && (_jsx("img", { loading: "lazy", height: 24, width: 24, id: "provider-logo-dark", src: `${provider.style.logo.startsWith("/") ? logos : ""}${provider.style.logoDark}` })), _jsxs("span", { children: ["Sign in with ", provider.name] })] })] })) : null, (provider.type === "email" || provider.type === "credentials") &&
                                i > 0 &&
                                providers[i - 1].type !== "email" &&
                                providers[i - 1].type !== "credentials" && _jsx("hr", {}), provider.type === "email" && (_jsxs("form", { action: provider.signinUrl, method: "POST", children: [_jsx("input", { type: "hidden", name: "csrfToken", value: csrfToken }), _jsx("label", { className: "section-header", htmlFor: `input-email-for-${provider.id}-provider`, children: "Email" }), _jsx("input", { id: `input-email-for-${provider.id}-provider`, autoFocus: true, type: "email", name: "email", value: email, placeholder: "email@example.com", required: true }), _jsxs("button", { type: "submit", children: ["Sign in with ", provider.name] })] })), provider.type === "credentials" && (_jsxs("form", { action: provider.callbackUrl, method: "POST", children: [_jsx("input", { type: "hidden", name: "csrfToken", value: csrfToken }), Object.keys(provider.credentials).map((credential) => {
                                        return (_jsxs("div", { children: [_jsx("label", { className: "section-header", htmlFor: `input-${credential}-for-${provider.id}-provider`, children: provider.credentials[credential].label ?? credential }), _jsx("input", { name: credential, id: `input-${credential}-for-${provider.id}-provider`, type: provider.credentials[credential].type ?? "text", placeholder: provider.credentials[credential].placeholder ?? "", ...provider.credentials[credential] })] }, `input-group-${provider.id}`));
                                    }), _jsxs("button", { id: "submitButton", type: "submit", children: ["Sign in with ", provider.name] })] })), (provider.type === "email" || provider.type === "credentials") &&
                                i + 1 < providers.length && _jsx("hr", {})] }, provider.id)))] })] }));
}
