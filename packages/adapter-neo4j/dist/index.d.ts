import type { Session } from "neo4j-driver";
import type { Adapter } from "next-auth/adapters";
import { format } from "./utils";
export { format };
export declare function Neo4jAdapter(session: Session): Adapter;
