import type { Connection, IDatabaseDriver, Options as ORMOptions } from "@mikro-orm/core";
import type { Adapter } from "next-auth/adapters";
import * as defaultEntities from "./entities";
export { defaultEntities };
/**
 * The MikroORM adapter accepts a MikroORM configuration and returns a NextAuth adapter.
 * @param ormConnection a MikroORM connection configuration (https://mikro-orm.io/docs/next/configuration#driver)
 * @param options entities in the options object will be passed to the MikroORM init function as entities. Has to be provided if overridden!
 * @returns
 */
export declare function MikroOrmAdapter<D extends IDatabaseDriver<Connection> = IDatabaseDriver<Connection>>(ormOptions: ORMOptions<D>, options?: {
    entities?: Partial<typeof defaultEntities>;
}): Adapter;
