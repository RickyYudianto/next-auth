/**
 * This module contains functions and types that a database adapter
 * can use to be compatible with Auth.js.
 *
 * A database adapter provides a common interface for Auth.js so that it can work with
 * _any_ database/ORM adapter without concerning itself with the implementation details of the database/ORM.
 *
 * Auth.js supports 2 session strtategies to persist the login state of a user.
 * The default is to use a cookie + {@link https://authjs.dev/concepts/session-strategies#jwt JWT}
 * based session store (`strategy: "jwt"`),
 * but you can also use a database adapter to store the session in a database.
 *
 * :::info Note
 * Auth.js _currently_ does **not** implement {@link https://authjs.dev/concepts/session-strategies#federated-logout federated logout}.
 * So even if the session is deleted from the database, the user will still be logged in to the provider (but will be logged out of the app).
 * See [this discussion](https://github.com/nextauthjs/next-auth/discussions/3938) for more information.
 * :::
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install @auth/core
 * ```
 *
 * You can then import this submodule from `@auth/core/adapters`.
 *
 * ## Usage
 *
 * {@link https://authjs.dev/reference/adapters/overview Built-in adapters} already implement this interfac, so you likely won't need to
 * implement it yourself. If you do, you can use the following example as a
 * starting point.
 *
 * ```ts title=your-adapter.ts
 * import { type Adapter } from "@auth/core/adapters"
 *
 * export function MyAdapter(config: {}): Adapter {
 *  // implement the adapter methods
 * }
 * ```
 *
 * ```ts title=index.ts
 * import { MyAdapter } from "./your-adapter"
 *
 * const response = Auth({
 *   adapter: MyAdapter({ /* ...adapter config *\/ }),
 *   // ... auth config
 * })
 * ```
 *
 * :::caution Note
 * Although `@auth/core` is framework/runtime agnostic, an adapter might rely on a client/ORM package,
 * that is not yet compatible with your runtime
 * (E.g. it might rely on [Node.js-specific APIs](https://nodejs.org/docs/latest/api)) when you are trying to use it elsewhere.
 * Related issues should be reported to the corresponding package maintainers.
 * :::
 *
 * ### Testing
 * :::tip
 * If you are writing your own adapter, there is a test suite [available](https://github.com/nextauthjs/next-auth/tree/main/packages/adapter-test)
 * to ensure that your adapter is compatible with Auth.js.
 * :::
 *
 * ## Resources
 *
 * - [What is a database session strategy?](https://authjs.dev/concepts/session-strategies#database)
 *
 * @module adapters
 */
export {};
