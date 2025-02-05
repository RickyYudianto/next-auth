"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = AzureADB2C;

function AzureADB2C(options) {
  var _options$issuer;

  const {
    tenantId,
    primaryUserFlow
  } = options;
  const issuer = (_options$issuer = options.issuer) !== null && _options$issuer !== void 0 ? _options$issuer : `https://${tenantId}.b2clogin.com/${tenantId}.onmicrosoft.com/${primaryUserFlow}/v2.0`;
  return {
    id: "azure-ad-b2c",
    name: "Azure Active Directory B2C",
    type: "oauth",
    wellKnown: `${issuer}/.well-known/openid-configuration`,
    idToken: true,

    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.emails[0],
        image: null
      };
    },

    style: {
      logo: "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/azure.svg",
      logoDark: "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/azure-dark.svg",
      bg: "#fff",
      text: "#0072c6",
      bgDark: "#0072c6",
      textDark: "#fff"
    },
    options
  };
}