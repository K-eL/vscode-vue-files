/**
 * @fileoverview Factory functions for creating test VueComponentSettings objects
 */
import { VueComponentSettings } from "../../../src/interfaces/vue-component-settings";
import { VueApiType } from "../../../src/enums/vue-api-type.enum";
import { VueScriptLang } from "../../../src/enums/vue-script-lang.enum";
import { VueStyleLang } from "../../../src/enums/vue-style-lang.enum";

/**
 * Default VueComponentSettings for tests
 */
export const DEFAULT_VUE_COMPONENT_SETTINGS: VueComponentSettings = {
	apiType: VueApiType.setup,
	scriptLang: VueScriptLang.typeScript,
	styleLang: VueStyleLang.scss,
	componentName: "TestComponent",
};

/**
 * Creates a VueComponentSettings object with optional overrides
 *
 * @param overrides - Partial VueComponentSettings to override defaults
 * @returns Complete VueComponentSettings object
 *
 * @example
 * ```typescript
 * // Default settings (Composition API + TS + SCSS)
 * const settings = createVueComponentSettings();
 *
 * // Options API with JavaScript
 * const optionsJs = createVueComponentSettings({
 *   apiType: VueApiType.options,
 *   scriptLang: VueScriptLang.javaScript,
 * });
 * ```
 */
export function createVueComponentSettings(
	overrides: Partial<VueComponentSettings> = {},
): VueComponentSettings {
	return {
		...DEFAULT_VUE_COMPONENT_SETTINGS,
		...overrides,
	};
}

/**
 * Creates VueComponentSettings for Composition API (script setup)
 *
 * @param scriptLang - Script language (default: TypeScript)
 * @param styleLang - Style language (default: SCSS)
 * @param componentName - Component name (default: "TestComponent")
 */
export function createCompositionApiSettings(
	scriptLang: VueScriptLang = VueScriptLang.typeScript,
	styleLang: VueStyleLang = VueStyleLang.scss,
	componentName = "TestComponent",
): VueComponentSettings {
	return {
		apiType: VueApiType.setup,
		scriptLang,
		styleLang,
		componentName,
	};
}

/**
 * Creates VueComponentSettings for Options API
 *
 * @param scriptLang - Script language (default: TypeScript)
 * @param styleLang - Style language (default: SCSS)
 * @param componentName - Component name (default: "TestComponent")
 */
export function createOptionsApiSettings(
	scriptLang: VueScriptLang = VueScriptLang.typeScript,
	styleLang: VueStyleLang = VueStyleLang.scss,
	componentName = "TestComponent",
): VueComponentSettings {
	return {
		apiType: VueApiType.options,
		scriptLang,
		styleLang,
		componentName,
	};
}

/**
 * Pre-built VueComponentSettings combinations for common test scenarios
 */
export const VueComponentSettingsPresets = {
	/** Composition API + TypeScript + SCSS */
	setupTsScss: createVueComponentSettings({
		apiType: VueApiType.setup,
		scriptLang: VueScriptLang.typeScript,
		styleLang: VueStyleLang.scss,
	}),

	/** Composition API + TypeScript + CSS */
	setupTsCss: createVueComponentSettings({
		apiType: VueApiType.setup,
		scriptLang: VueScriptLang.typeScript,
		styleLang: VueStyleLang.css,
	}),

	/** Composition API + JavaScript + SCSS */
	setupJsScss: createVueComponentSettings({
		apiType: VueApiType.setup,
		scriptLang: VueScriptLang.javaScript,
		styleLang: VueStyleLang.scss,
	}),

	/** Composition API + JavaScript + CSS */
	setupJsCss: createVueComponentSettings({
		apiType: VueApiType.setup,
		scriptLang: VueScriptLang.javaScript,
		styleLang: VueStyleLang.css,
	}),

	/** Options API + TypeScript + SCSS */
	optionsTsScss: createVueComponentSettings({
		apiType: VueApiType.options,
		scriptLang: VueScriptLang.typeScript,
		styleLang: VueStyleLang.scss,
	}),

	/** Options API + TypeScript + CSS */
	optionsTsCss: createVueComponentSettings({
		apiType: VueApiType.options,
		scriptLang: VueScriptLang.typeScript,
		styleLang: VueStyleLang.css,
	}),

	/** Options API + JavaScript + SCSS */
	optionsJsScss: createVueComponentSettings({
		apiType: VueApiType.options,
		scriptLang: VueScriptLang.javaScript,
		styleLang: VueStyleLang.scss,
	}),

	/** Options API + JavaScript + CSS */
	optionsJsCss: createVueComponentSettings({
		apiType: VueApiType.options,
		scriptLang: VueScriptLang.javaScript,
		styleLang: VueStyleLang.css,
	}),
} as const;
