"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = LINE;

function LINE(options) {
  return {
    id: "line",
    name: "LINE",
    type: "oauth",
    authorization: {
      params: {
        scope: "openid profile"
      }
    },
    idToken: true,
    wellKnown: "https://access.line.me/.well-known/openid-configuration",

    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture
      };
    },

    client: {
      id_token_signed_response_alg: "HS256"
    },
    style: {
      logo: "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/line.svg",
      logoDark: "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/line.svg",
      bg: "#fff",
      text: "#00C300",
      bgDark: "#00C300",
      textDark: "#fff"
    },
    options
  };
}