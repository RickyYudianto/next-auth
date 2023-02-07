import type { Adapter } from "next-auth/adapters";
import { DataSourceOptions, EntityManager } from "typeorm";
import * as defaultEntities from "./entities";
export declare const entities: typeof defaultEntities;
export declare type Entities = typeof entities;
export interface TypeORMLegacyAdapterOptions {
    entities?: Entities;
}
export declare function getManager(options: {
    dataSource: string | DataSourceOptions;
    entities: Entities;
}): Promise<EntityManager>;
export declare function TypeORMLegacyAdapter(dataSource: string | DataSourceOptions, options?: TypeORMLegacyAdapterOptions): Adapter;
