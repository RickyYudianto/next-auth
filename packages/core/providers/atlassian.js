export default function Atlassian(options) {
    return {
        id: "atlassian",
        name: "Atlassian",
        type: "oauth",
        authorization: {
            url: "https://auth.atlassian.com/authorize",
            params: {
                audience: "api.atlassian.com",
                prompt: "consent",
            },
        },
        token: "https://auth.atlassian.com/oauth/token",
        userinfo: "https://api.atlassian.com/me",
        profile(profile) {
            return {
                id: profile.account_id,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
            };
        },
        style: {
            logo: "/atlassian.svg",
            logoDark: "/atlassian-dark.svg",
            bg: "#0052cc",
            text: "#fff",
            bgDark: "#fff",
            textDark: "#0052cc",
        },
        options,
    };
}
