
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const MANPATH: string;
	export const npm_package_repository: string;
	export const NODE: string;
	export const INIT_CWD: string;
	export const npm_package_homepage: string;
	export const npm_package_devDependencies_typescript: string;
	export const SHELL: string;
	export const TERM: string;
	export const npm_package_devDependencies_vite: string;
	export const TMPDIR: string;
	export const HOMEBREW_REPOSITORY: string;
	export const npm_package_peerDependencies__sveltejs_kit: string;
	export const npm_package_scripts_dev: string;
	export const TERM_SESSION_ID: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const npm_config_registry: string;
	export const PNPM_HOME: string;
	export const __INTELLIJ_COMMAND_HISTFILE__: string;
	export const npm_package_exports___client_types: string;
	export const USER: string;
	export const npm_package_description: string;
	export const npm_package_scripts_check_watch: string;
	export const npm_package_exports___package_json: string;
	export const COMMAND_MODE: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const npm_package_exports___import: string;
	export const SSH_AUTH_SOCK: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const LOGIN_SHELL: string;
	export const npm_package_devDependencies_tslib: string;
	export const npm_package_dependencies__auth_core: string;
	export const npm_execpath: string;
	export const npm_package_devDependencies_svelte: string;
	export const PATH: string;
	export const TERMINAL_EMULATOR: string;
	export const __CFBundleIdentifier: string;
	export const npm_package_keywords_4: string;
	export const npm_package_author: string;
	export const PWD: string;
	export const npm_package_keywords_5: string;
	export const npm_command: string;
	export const npm_package_keywords_6: string;
	export const npm_package_contributors_4: string;
	export const npm_package_scripts_preview: string;
	export const npm_package_devDependencies__sveltejs_package: string;
	export const npm_package_keywords_7: string;
	export const npm_lifecycle_event: string;
	export const npm_package_name: string;
	export const npm_package_keywords_0: string;
	export const npm_package_contributors_2: string;
	export const npm_package_types: string;
	export const npm_package_keywords_1: string;
	export const npm_package_contributors_3: string;
	export const NODE_PATH: string;
	export const npm_package_keywords_2: string;
	export const npm_package_contributors_0: string;
	export const npm_package_scripts_build: string;
	export const npm_package_exports___types: string;
	export const TURBO_HASH: string;
	export const XPC_FLAGS: string;
	export const npm_package_keywords_3: string;
	export const npm_package_contributors_1: string;
	export const npm_package_devDependencies_vitest: string;
	export const npm_config_node_gyp: string;
	export const XPC_SERVICE_NAME: string;
	export const npm_package_version: string;
	export const npm_package_devDependencies__sveltejs_adapter_auto: string;
	export const npm_package_devDependencies_next_auth: string;
	export const npm_package_devDependencies_svelte_check: string;
	export const HOME: string;
	export const SHLVL: string;
	export const npm_package_type: string;
	export const HOMEBREW_PREFIX: string;
	export const LOGNAME: string;
	export const npm_package_peerDependencies_svelte: string;
	export const npm_lifecycle_script: string;
	export const LC_CTYPE: string;
	export const npm_package_exports___client_import: string;
	export const npm_config_user_agent: string;
	export const HOMEBREW_CELLAR: string;
	export const INFOPATH: string;
	export const npm_package_devDependencies__playwright_test: string;
	export const npm_package_files_2: string;
	export const npm_package_files_1: string;
	export const npm_package_files_0: string;
	export const npm_package_scripts_clean: string;
	export const npm_package_scripts_check: string;
	export const npm_package_scripts_test_unit: string;
	export const npm_node_execpath: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {

}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		MANPATH: string;
		npm_package_repository: string;
		NODE: string;
		INIT_CWD: string;
		npm_package_homepage: string;
		npm_package_devDependencies_typescript: string;
		SHELL: string;
		TERM: string;
		npm_package_devDependencies_vite: string;
		TMPDIR: string;
		HOMEBREW_REPOSITORY: string;
		npm_package_peerDependencies__sveltejs_kit: string;
		npm_package_scripts_dev: string;
		TERM_SESSION_ID: string;
		npm_package_devDependencies__sveltejs_kit: string;
		npm_config_registry: string;
		PNPM_HOME: string;
		__INTELLIJ_COMMAND_HISTFILE__: string;
		npm_package_exports___client_types: string;
		USER: string;
		npm_package_description: string;
		npm_package_scripts_check_watch: string;
		npm_package_exports___package_json: string;
		COMMAND_MODE: string;
		PNPM_SCRIPT_SRC_DIR: string;
		npm_package_exports___import: string;
		SSH_AUTH_SOCK: string;
		__CF_USER_TEXT_ENCODING: string;
		LOGIN_SHELL: string;
		npm_package_devDependencies_tslib: string;
		npm_package_dependencies__auth_core: string;
		npm_execpath: string;
		npm_package_devDependencies_svelte: string;
		PATH: string;
		TERMINAL_EMULATOR: string;
		__CFBundleIdentifier: string;
		npm_package_keywords_4: string;
		npm_package_author: string;
		PWD: string;
		npm_package_keywords_5: string;
		npm_command: string;
		npm_package_keywords_6: string;
		npm_package_contributors_4: string;
		npm_package_scripts_preview: string;
		npm_package_devDependencies__sveltejs_package: string;
		npm_package_keywords_7: string;
		npm_lifecycle_event: string;
		npm_package_name: string;
		npm_package_keywords_0: string;
		npm_package_contributors_2: string;
		npm_package_types: string;
		npm_package_keywords_1: string;
		npm_package_contributors_3: string;
		NODE_PATH: string;
		npm_package_keywords_2: string;
		npm_package_contributors_0: string;
		npm_package_scripts_build: string;
		npm_package_exports___types: string;
		TURBO_HASH: string;
		XPC_FLAGS: string;
		npm_package_keywords_3: string;
		npm_package_contributors_1: string;
		npm_package_devDependencies_vitest: string;
		npm_config_node_gyp: string;
		XPC_SERVICE_NAME: string;
		npm_package_version: string;
		npm_package_devDependencies__sveltejs_adapter_auto: string;
		npm_package_devDependencies_next_auth: string;
		npm_package_devDependencies_svelte_check: string;
		HOME: string;
		SHLVL: string;
		npm_package_type: string;
		HOMEBREW_PREFIX: string;
		LOGNAME: string;
		npm_package_peerDependencies_svelte: string;
		npm_lifecycle_script: string;
		LC_CTYPE: string;
		npm_package_exports___client_import: string;
		npm_config_user_agent: string;
		HOMEBREW_CELLAR: string;
		INFOPATH: string;
		npm_package_devDependencies__playwright_test: string;
		npm_package_files_2: string;
		npm_package_files_1: string;
		npm_package_files_0: string;
		npm_package_scripts_clean: string;
		npm_package_scripts_check: string;
		npm_package_scripts_test_unit: string;
		npm_node_execpath: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: string]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
