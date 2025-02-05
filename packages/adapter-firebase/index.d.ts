/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 * <span>
 *  Official <b>Firebase</b> adapter for Auth.js / NextAuth.js,
 *  using the <a href="https://firebase.google.com/docs/admin/setup">Firebase Admin SDK</a>
 *  &nbsp;and <a href="https://firebase.google.com/docs/firestore">Firestore</a>.</span>
 * <a href="https://firebase.google.com/">
 *   <img style={{display: "block"}} src="https://raw.githubusercontent.com/nextauthjs/next-auth/main/packages/adapter-firebase/logo.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install next-auth @next-auth/firebase-admin-adapter firebase-admin
 * ```
 *
 * ## References
 * - [`GOOGLE_APPLICATION_CREDENTIALS` environment variable](https://cloud.google.com/docs/authentication/application-default-credentials#GAC)
 * - [Firebase Admin SDK setup](https://firebase.google.com/docs/admin/setup#initialize-sdk)
 *
 * @module @next-auth/firebase-adapter
 */
import { type AppOptions } from "firebase-admin";
import { Firestore } from "firebase-admin/firestore";
import type { Adapter } from "next-auth/adapters";
export { initFirestore } from "./utils";
/** Configure the Firebase Adapter. */
export interface FirebaseAdapterConfig extends AppOptions {
    /**
     * The name of the app passed to {@link https://firebase.google.com/docs/reference/admin/node/firebase-admin.md#initializeapp `initializeApp()`}.
     */
    name?: string;
    firestore?: Firestore;
    /**
     * Use this option if mixed `snake_case` and `camelCase` field names in the database is an issue for you.
     * Passing `snake_case` will convert all field and collection names to `snake_case`.
     * E.g. the collection `verificationTokens` will be `verification_tokens`,
     * and fields like `emailVerified` will be `email_verified` instead.
     *
     *
     * @example
     * ```ts title="pages/api/auth/[...nextauth].ts"
     * import NextAuth from "next-auth"
     * import { FirestoreAdapter } from "@next-auth/firebase-adapter"
     *
     * export default NextAuth({
     *  adapter: FirestoreAdapter({ namingStrategy: "snake_case" })
     *  // ...
     * })
     * ```
     */
    namingStrategy?: "snake_case";
}
/**
 * #### Usage
 *
 * First, create a Firebase project and generate a service account key.
 * Visit: `https://console.firebase.google.com/u/0/project/{project-id}/settings/serviceaccounts/adminsdk` (replace `{project-id}` with your project's id)
 *
 * Now you have a few options to authenticate with the Firebase Admin SDK in your app:
 *
 * ##### 1. `GOOGLE_APPLICATION_CREDENTIALS` environment variable:
 *  - Download the service account key and save it in your project. (Make sure to add the file to your `.gitignore`!)
 *  - Add [`GOOGLE_APPLICATION_CREDENTIALS`](https://cloud.google.com/docs/authentication/application-default-credentials#GAC) to your environment variables and point it to the service account key file.
 *  - The adapter will automatically pick up the environment variable and use it to authenticate with the Firebase Admin SDK.
 *
 * @example
 * ```ts title="pages/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import { FirestoreAdapter } from "@next-auth/firebase-adapter"
 *
 * export default NextAuth({
 *   adapter: FirestoreAdapter(),
 *   // ...
 * })
 * ```
 *
 * ##### 2. Service account values as environment variables
 *
 * - Download the service account key to a temporary location. (Make sure to not commit this file to your repository!)
 * - Add the following environment variables to your project: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.
 * - Pass the config to the adapter, using the environment variables as shown in the example below.
 *
 * @example
 * ```ts title="pages/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import { FirestoreAdapter } from "@next-auth/firebase-adapter"
 * import { cert } from "firebase-admin/app"
 *
 * export default NextAuth({
 *  adapter: FirestoreAdapter({
 *    credential: cert({
 *      projectId: process.env.FIREBASE_PROJECT_ID,
 *      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
 *      privateKey: process.env.FIREBASE_PRIVATE_KEY,
 *    })
 *  })
 *  // ...
 * })
 * ```
 *
 * ##### 3. Use an existing Firestore instance
 *
 * If you already have a Firestore instance, you can pass that to the adapter directly instead.
 *
 * :::note
 * When passing an instance and in a serverless environment, remember to handle duplicate app initialization.
 * :::
 *
 * :::tip
 * You can use the {@link initFirestore} utility to initialize the app and get an instance safely.
 * :::
 *
 * @example
 * ```ts title="pages/api/auth/[...nextauth].ts"
 * import NextAuth from "next-auth"
 * import { FirestoreAdapter } from "@next-auth/firebase-adapter"
 * import { firestore } from "lib/firestore"
 *
 * export default NextAuth({
 *  adapter: FirestoreAdapter(firestore),
 *  // ...
 * })
 * ```
 */
export declare function FirestoreAdapter(config?: FirebaseAdapterConfig | Firestore): Adapter;
//# sourceMappingURL=index.d.ts.map