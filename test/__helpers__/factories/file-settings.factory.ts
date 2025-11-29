/**
 * @fileoverview Factory functions for creating test FileSettings objects
 */
import { FileSettings } from "../../../src/interfaces/file-settings";
import { VueApiType } from "../../../src/enums/vue-api-type.enum";
import { VueScriptLang } from "../../../src/enums/vue-script-lang.enum";
import { VueStyleLang } from "../../../src/enums/vue-style-lang.enum";

/**
 * Default FileSettings for tests
 */
export const DEFAULT_FILE_SETTINGS: FileSettings = {
	apiType: VueApiType.setup,
	scriptLang: VueScriptLang.typeScript,
	styleLang: VueStyleLang.scss,
	componentName: "TestComponent",
};

/**
 * Creates a FileSettings object with optional overrides
 *
 * @param overrides - Partial FileSettings to override defaults
 * @returns Complete FileSettings object
 *
 * @example
 * ```typescript
 * // Default settings (Composition API + TS + SCSS)
 * const settings = createFileSettings();
 *
 * // Options API with JavaScript
 * const optionsJs = createFileSettings({
 *   apiType: VueApiType.options,
 *   scriptLang: VueScriptLang.javaScript,
 * });
 * ```
 */
export function createFileSettings(
	overrides: Partial<FileSettings> = {},
): FileSettings {
	return {
		...DEFAULT_FILE_SETTINGS,
		...overrides,
	};
}

/**
 * Creates FileSettings for Composition API (script setup)
 *
 * @param scriptLang - Script language (default: TypeScript)
 * @param styleLang - Style language (default: SCSS)
 * @param componentName - Component name (default: "TestComponent")
 */
export function createCompositionApiSettings(
	scriptLang: VueScriptLang = VueScriptLang.typeScript,
	styleLang: VueStyleLang = VueStyleLang.scss,
	componentName = "TestComponent",
): FileSettings {
	return {
		apiType: VueApiType.setup,
		scriptLang,
		styleLang,
		componentName,
	};
}

/**
 * Creates FileSettings for Options API
 *
 * @param scriptLang - Script language (default: TypeScript)
 * @param styleLang - Style language (default: SCSS)
 * @param componentName - Component name (default: "TestComponent")
 */
export function createOptionsApiSettings(
	scriptLang: VueScriptLang = VueScriptLang.typeScript,
	styleLang: VueStyleLang = VueStyleLang.scss,
	componentName = "TestComponent",
): FileSettings {
	return {
		apiType: VueApiType.options,
		scriptLang,
		styleLang,
		componentName,
	};
}

/**
 * Pre-built FileSettings combinations for common test scenarios
 */
export const FileSettingsPresets = {
	/** Composition API + TypeScript + SCSS */
	setupTsScss: createFileSettings({
		apiType: VueApiType.setup,
		scriptLang: VueScriptLang.typeScript,
		styleLang: VueStyleLang.scss,
	}),

	/** Composition API + TypeScript + CSS */
	setupTsCss: createFileSettings({
		apiType: VueApiType.setup,
		scriptLang: VueScriptLang.typeScript,
		styleLang: VueStyleLang.css,
	}),

	/** Composition API + JavaScript + SCSS */
	setupJsScss: createFileSettings({
		apiType: VueApiType.setup,
		scriptLang: VueScriptLang.javaScript,
		styleLang: VueStyleLang.scss,
	}),

	/** Composition API + JavaScript + CSS */
	setupJsCss: createFileSettings({
		apiType: VueApiType.setup,
		scriptLang: VueScriptLang.javaScript,
		styleLang: VueStyleLang.css,
	}),

	/** Options API + TypeScript + SCSS */
	optionsTsScss: createFileSettings({
		apiType: VueApiType.options,
		scriptLang: VueScriptLang.typeScript,
		styleLang: VueStyleLang.scss,
	}),

	/** Options API + TypeScript + CSS */
	optionsTsCss: createFileSettings({
		apiType: VueApiType.options,
		scriptLang: VueScriptLang.typeScript,
		styleLang: VueStyleLang.css,
	}),

	/** Options API + JavaScript + SCSS */
	optionsJsScss: createFileSettings({
		apiType: VueApiType.options,
		scriptLang: VueScriptLang.javaScript,
		styleLang: VueStyleLang.scss,
	}),

	/** Options API + JavaScript + CSS */
	optionsJsCss: createFileSettings({
		apiType: VueApiType.options,
		scriptLang: VueScriptLang.javaScript,
		styleLang: VueStyleLang.css,
	}),
} as const;
