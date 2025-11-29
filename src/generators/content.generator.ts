/**
 * @fileoverview Main content generator for Vue single-file components.
 * Orchestrates the generation of template, script, and style sections.
 *
 * @module generators/content
 */
import { FileSettings } from "../interfaces/file-settings";
import { VueApiType } from "../enums/vue-api-type.enum";
import { VueScriptLang } from "../enums/vue-script-lang.enum";
import { VueStyleLang } from "../enums/vue-style-lang.enum";
import { generateOptionsApiScriptTemplate } from "./options-script.generator";
import { generateCompositionApiScriptTemplate } from "./composition-script.generator";
import { ConfigHelper } from "../helpers/config.helper";
import {
	GeneratorContext,
	createGeneratorContext,
} from "../interfaces/generator-context";

/**
 * Generates the complete content for a Vue single-file component.
 * Depending on configuration, generates either template-first or script-first layout.
 *
 * @param fileSettings - Settings for the file (API type, languages, component name)
 * @param configHelper - Configuration helper instance
 * @returns Complete Vue SFC content as a string
 *
 * @example
 * ```typescript
 * const settings: FileSettings = {
 *   apiType: VueApiType.setup,
 *   scriptLang: VueScriptLang.typeScript,
 *   styleLang: VueStyleLang.scss,
 *   componentName: "MyComponent",
 * };
 * const content = generateContent(settings, ConfigHelper.getInstance());
 * ```
 */
export const generateContent = (
	fileSettings: FileSettings,
	configHelper: ConfigHelper,
): string => {
	const { scriptLang } = fileSettings;
	const isTs = scriptLang === VueScriptLang.typeScript;
	const ctx = createGeneratorContext(isTs, configHelper);

	return configHelper.isScriptFirst()
		? generateContentScriptFirst(fileSettings, ctx)
		: generateContentTemplateFirst(fileSettings, ctx);
};

/**
 * Generates content with script section first.
 */
const generateContentScriptFirst = (
	fileSettings: FileSettings,
	ctx: GeneratorContext,
): string => {
	const { apiType, scriptLang, styleLang, componentName } = fileSettings;
	const isSetupApi = apiType === VueApiType.setup;

	return (
		generateScriptContent(isSetupApi, scriptLang, componentName, ctx) +
		generateTemplate(ctx) +
		generateStyleContent(styleLang, true)
	);
};

/**
 * Generates content with template section first.
 */
const generateContentTemplateFirst = (
	fileSettings: FileSettings,
	ctx: GeneratorContext,
): string => {
	const { apiType, scriptLang, styleLang, componentName } = fileSettings;
	const isSetupApi = apiType === VueApiType.setup;

	return (
		generateTemplate(ctx) +
		generateScriptContent(isSetupApi, scriptLang, componentName, ctx) +
		generateStyleContent(styleLang, true)
	);
};

/**
 * Generates the script section of the Vue SFC.
 * For Composition API, generates a script setup block.
 * For Options API, generates a traditional script block with defineComponent.
 */
const generateScriptContent = (
	isSetupApi: boolean,
	scriptLang: VueScriptLang,
	componentName: string,
	ctx: GeneratorContext,
): string => {
	const optionsTemplate = generateOptionsApiScriptTemplate(componentName, ctx);
	const setupTemplate = generateCompositionApiScriptTemplate(ctx);

	return (
		`<script ${isSetupApi ? "setup " : ""}lang='${scriptLang}'>` +
		`\n` +
		`${!isSetupApi ? optionsTemplate : setupTemplate}` +
		`</script>` +
		`\n\n` +
		`${isSetupApi ? generateInheritAttrs(scriptLang, ctx) : ``}`
	);
};

/**
 * Generates an additional script block for inheritAttrs when using script setup.
 * This is needed because script setup doesn't support component options directly.
 */
const generateInheritAttrs = (
	scriptLang: VueScriptLang,
	ctx: GeneratorContext,
): string => {
	const { config, ind } = ctx;
	if (!config.options.showInheritAttrs()) return ``;

	return (
		`<script lang='${scriptLang}'>` +
		`\n` +
		ind() +
		`export default {` +
		`\n` +
		ind(2) +
		`inheritAttrs: false,` +
		`\n` +
		ind() +
		`};` +
		`\n` +
		`</script>` +
		`\n\n`
	);
};

/**
 * Generates the template section of the Vue SFC.
 */
const generateTemplate = (ctx: GeneratorContext): string => {
	const { ind } = ctx;

	return (
		`<template>` +
		`\n` +
		ind() +
		`<div>` +
		`\n` +
		generateTemplateVModel(ctx) +
		ind() +
		`</div>` +
		`\n` +
		`</template>` +
		`\n\n`
	);
};

/**
 * Generates v-model input template if enabled.
 */
const generateTemplateVModel = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.showVModelTemplate()) return "";
	return ind(2) + `<input v-model="value" />` + `\n`;
};

/**
 * Generates the style section of the Vue SFC.
 *
 * @param styleLang - CSS preprocessor language (css, scss, etc.)
 * @param scoped - Whether to add the scoped attribute
 */
const generateStyleContent = (
	styleLang: VueStyleLang,
	scoped: boolean,
): string => {
	return (
		`<style ${scoped ? "scoped " : ""}lang="${styleLang}">` + `\n` + `</style>`
	);
};
