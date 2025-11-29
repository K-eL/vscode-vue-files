/**
 * Script language options for Vue single-file components
 * Determines the `lang` attribute in `<script>` tag
 */
export enum VueScriptLang {
	/**
	 * TypeScript - Strongly typed JavaScript superset
	 * Generates: `<script lang="ts">`
	 */
	typeScript = "ts",

	/**
	 * JavaScript - Standard ECMAScript
	 * Generates: `<script lang="js">`
	 */
	javaScript = "js",
}
