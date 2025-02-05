"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Wikimedia;

function Wikimedia(options) {
  return {
    id: "wikimedia",
    name: "Wikimedia",
    type: "oauth",
    token: "https://meta.wikimedia.org/w/rest.php/oauth2/access_token",
    userinfo: "https://meta.wikimedia.org/w/rest.php/oauth2/resource/profile",
    authorization: {
      url: "https://meta.wikimedia.org/w/rest.php/oauth2/authorize",
      params: {
        scope: ""
      }
    },

    profile(profile) {
      return {
        id: profile.sub,
        name: profile.username,
        email: profile.email
      };
    },

    style: {
      logo: "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/wikimedia.svg",
      logoDark: "https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/next-auth/provider-logos/wikimedia-dark.svg",
      bg: "#fff",
      text: "#000",
      bgDark: "#000",
      textDark: "#fff"
    },
    options
  };
}