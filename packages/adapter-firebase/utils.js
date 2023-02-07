import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, initializeFirestore, Timestamp, } from "firebase-admin/firestore";
// for consistency, store all fields as snake_case in the database
const MAP_TO_FIRESTORE = {
    userId: "user_id",
    sessionToken: "session_token",
    providerAccountId: "provider_account_id",
    emailVerified: "email_verified",
};
const MAP_FROM_FIRESTORE = {};
for (const key in MAP_TO_FIRESTORE) {
    MAP_FROM_FIRESTORE[MAP_TO_FIRESTORE[key]] = key;
}
const identity = (x) => x;
/** @internal */
export function mapFieldsFactory(preferSnakeCase) {
    if (preferSnakeCase) {
        return {
            toDb: (field) => MAP_TO_FIRESTORE[field] ?? field,
            fromDb: (field) => MAP_FROM_FIRESTORE[field] ?? field,
        };
    }
    return { toDb: identity, fromDb: identity };
}
/** @internal */
export function getConverter(options) {
    const mapper = mapFieldsFactory(options?.preferSnakeCase ?? false);
    return {
        toFirestore(object) {
            const document = {};
            for (const key in object) {
                if (key === "id")
                    continue;
                const value = object[key];
                if (value !== undefined) {
                    document[mapper.toDb(key)] = value;
                }
                else {
                    console.warn(`FirebaseAdapter: value for key "${key}" is undefined`);
                }
            }
            return document;
        },
        fromFirestore(snapshot) {
            const document = snapshot.data(); // we can guarentee it exists
            const object = {};
            if (!options?.excludeId) {
                object.id = snapshot.id;
            }
            for (const key in document) {
                let value = document[key];
                if (value instanceof Timestamp)
                    value = value.toDate();
                object[mapper.fromDb(key)] = value;
            }
            return object;
        },
    };
}
/** @internal */
export async function getOneDoc(querySnapshot) {
    const querySnap = await querySnapshot.limit(1).get();
    return querySnap.docs[0]?.data() ?? null;
}
/** @internal */
export async function deleteDocs(querySnapshot) {
    const querySnap = await querySnapshot.get();
    for (const doc of querySnap.docs) {
        await doc.ref.delete();
    }
}
/** @internal */
export async function getDoc(docRef) {
    const docSnap = await docRef.get();
    return docSnap.data() ?? null;
}
/** @internal */
export function collestionsFactory(db, preferSnakeCase = false) {
    return {
        users: db
            .collection("users")
            .withConverter(getConverter({ preferSnakeCase })),
        sessions: db
            .collection("sessions")
            .withConverter(getConverter({ preferSnakeCase })),
        accounts: db
            .collection("accounts")
            .withConverter(getConverter({ preferSnakeCase })),
        verification_tokens: db
            .collection(preferSnakeCase ? "verification_tokens" : "verificationTokens")
            .withConverter(getConverter({ preferSnakeCase, excludeId: true })),
    };
}
/**
 * Utility function that helps making sure that there is no duplicate app initialization issues in serverless environments.
 * If no parameter is passed, it will use the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to initialize a Firestore instance.
 *
 * @example
 * ```ts title="lib/firestore.ts"
 * import { initFirestore } from "@next-auth/firebase-adapter"
 * import { cert } from "firebase-admin/app"
 *
 * export const firestore = initFirestore({
 *  credential: cert({
 *    projectId: process.env.FIREBASE_PROJECT_ID,
 *    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
 *    privateKey: process.env.FIREBASE_PRIVATE_KEY,
 *  })
 * })
 * ```
 */
export function initFirestore(options = {}) {
    const apps = getApps();
    const app = options.name ? apps.find((a) => a.name === options.name) : apps[0];
    if (app)
        return getFirestore(app);
    return initializeFirestore(initializeApp(options, options.name));
}
