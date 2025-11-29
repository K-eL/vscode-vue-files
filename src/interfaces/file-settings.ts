import { VueApiType } from "../enums/vue-api-type.enum";
import { VueScriptLang } from "../enums/vue-script-lang.enum";
import { VueStyleLang } from "../enums/vue-style-lang.enum";

/**
 * Configuration settings for generating a Vue single-file component
 *
 * @example
 * ```typescript
 * const settings: FileSettings = {
 *   apiType: VueApiType.setup,
 *   scriptLang: VueScriptLang.typeScript,
 *   styleLang: VueStyleLang.scss,
 *   componentName: "MyComponent",
 * };
 * ```
 */
export interface FileSettings {
	/**
	 * Vue API style to use for the component
	 * - `VueApiType.setup`: Generates Composition API with `<script setup>` syntax
	 * - `VueApiType.options`: Generates Options API with `defineComponent()`
	 */
	apiType: VueApiType;

	/**
	 * Script language for the component
	 * Determines the `lang` attribute in `<script>` tag
	 */
	scriptLang: VueScriptLang;

	/**
	 * Style language for the component
	 * Determines the `lang` attribute in `<style>` tag
	 */
	styleLang: VueStyleLang;

	/**
	 * Component name in PascalCase
	 * Used for the component's `name` option and display purposes
	 */
	componentName: string;
}
