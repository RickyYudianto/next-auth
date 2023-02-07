import type { Adapter } from "next-auth/adapters";
import type { Redis } from "@upstash/redis";
export interface UpstashRedisAdapterOptions {
    baseKeyPrefix?: string;
    accountKeyPrefix?: string;
    accountByUserIdPrefix?: string;
    emailKeyPrefix?: string;
    sessionKeyPrefix?: string;
    sessionByUserIdKeyPrefix?: string;
    userKeyPrefix?: string;
    verificationTokenKeyPrefix?: string;
}
export declare const defaultOptions: {
    baseKeyPrefix: string;
    accountKeyPrefix: string;
    accountByUserIdPrefix: string;
    emailKeyPrefix: string;
    sessionKeyPrefix: string;
    sessionByUserIdKeyPrefix: string;
    userKeyPrefix: string;
    verificationTokenKeyPrefix: string;
};
export declare function hydrateDates(json: object): any;
export declare function UpstashRedisAdapter(client: Redis, options?: UpstashRedisAdapterOptions): Adapter;
