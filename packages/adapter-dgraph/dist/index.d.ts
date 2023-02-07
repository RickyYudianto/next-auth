import { format } from "./utils";
import type { Adapter } from "next-auth/adapters";
import type { DgraphClientParams } from "./client";
export type { DgraphClientParams, DgraphClientError } from "./client";
export interface DgraphAdapterOptions {
    fragments?: {
        User?: string;
        Account?: string;
        Session?: string;
        VerificationToken?: string;
    };
}
export { format };
export declare function DgraphAdapter(client: DgraphClientParams, options?: DgraphAdapterOptions): Adapter;
