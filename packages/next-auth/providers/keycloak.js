"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Keycloak;

function Keycloak(options) {
  return {
    id: "keycloak",
    name: "Keycloak",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    type: "oauth",
    authorization: {
      params: {
        scope: "openid email profile"
      }
    },
    checks: ["pkce", "state"],
    idToken: true,

    profile(profile) {
      var _profile$name;

      return {
        id: profile.sub,
        name: (_profile$name = profile.name) !== null && _profile$name !== void 0 ? _profile$name : profile.preferred_username,
        email: profile.email,
        image: profile.picture
      };
    },

    style: {
      logo: "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/keycloak.svg",
      logoDark: "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/keycloak.svg",
      bg: "#fff",
      text: "#000",
      bgDark: "#fff",
      textDark: "#000"
    },
    options
  };
}