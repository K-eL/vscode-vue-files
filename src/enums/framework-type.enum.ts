/**
 * Vue framework types that can be auto-detected or manually configured
 * Used to customize file generation based on project structure
 */
export enum FrameworkType {
	/**
	 * Nuxt.js - Full-stack Vue framework
	 * @see https://nuxt.com
	 */
	Nuxt = "nuxt",

	/**
	 * Vite - Next generation frontend tooling
	 * @see https://vitejs.dev
	 */
	Vite = "vite",

	/**
	 * Vue CLI - Standard tooling for Vue development
	 * @see https://cli.vuejs.org
	 */
	VueCli = "vue-cli",

	/**
	 * No framework detected or manual mode
	 */
	None = "none",
}
