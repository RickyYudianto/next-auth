export default function AzureADB2C(options) {
    const { tenantId, primaryUserFlow } = options;
    options.issuer ?? (options.issuer = `https://${tenantId}.b2clogin.com/${tenantId}.onmicrosoft.com/${primaryUserFlow}/v2.0`);
    return {
        id: "azure-ad-b2c",
        name: "Azure Active Directory B2C",
        type: "oidc",
        profile(profile) {
            return {
                id: profile.sub,
                name: profile.name,
                email: profile.emails[0],
                image: null,
            };
        },
        style: {
            logo: "/azure.svg",
            logoDark: "/azure-dark.svg",
            bg: "#fff",
            text: "#0072c6",
            bgDark: "#0072c6",
            textDark: "#fff",
        },
        options,
    };
}
