/** @type {import(".").OAuthProvider} */
export default function Yandex(options: any): {
    id: string;
    name: string;
    type: string;
    authorization: string;
    token: string;
    userinfo: string;
    profile(profile: any): {
        id: any;
        name: any;
        email: any;
        image: string | null;
    };
    options: any;
};
//# sourceMappingURL=yandex.d.ts.map