/**
 * Vue component API styles
 * @see https://vuejs.org/guide/introduction.html#api-styles
 */
export enum VueApiType {
	/**
	 * Composition API with `<script setup>` syntax
	 * Modern, flexible approach using composables and refs
	 */
	setup = "setup",

	/**
	 * Options API with `defineComponent()`
	 * Traditional object-based approach with data, methods, etc.
	 */
	options = "options",
}
