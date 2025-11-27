import { FileSettings } from "../interfaces/file-settings";
import { VueScriptLang } from "../enums/vue-script-lang.enum";
import { VueStyleLang } from "../enums/vue-style-lang.enum";
import { generateOptionsApiScriptTemplate } from "./options-script.generator";
import { generateCompositionApiScriptTemplate } from "./composition-script.generator";
import { ConfigHelper } from "../helpers/config.helper";

let _configHelper = new ConfigHelper();
let ind: (x?: number) => string;

/**
 *  Generates the content for the script that will be included in the Vue component. Depending on the parameters, it will generate either the OptionsApiScriptTemplate script or the CompositionApiScriptTemplate script. It will also generate the Template and Style content accordingly.
 * @param fileSettings The settings for the file. It includes the api type, script language, style language, and component name.
 * @returns string
 * */
export const generateContent = (
	fileSettings: FileSettings,
	configHelper: ConfigHelper,
) => {
	_configHelper = configHelper;
	ind = configHelper.ind;
	return configHelper.isScriptFirst()
		? generateContentScriptFirst(fileSettings)
		: generateContentTemplateFirst(fileSettings);
};

const generateContentScriptFirst = (fileSettings: FileSettings) => {
	const { isSetupApi, scriptLang, styleLang, componentName } = fileSettings;
	return (
		generateScriptContent(isSetupApi, scriptLang, componentName) +
		generateTemplate() +
		generateStyleContent(styleLang, true)
	);
};

const generateContentTemplateFirst = (fileSettings: FileSettings) => {
	const { isSetupApi, scriptLang, styleLang, componentName } = fileSettings;
	return (
		generateTemplate() +
		generateScriptContent(isSetupApi, scriptLang, componentName) +
		generateStyleContent(styleLang, true)
	);
};

const generateScriptContent = (
	isSetupApi: boolean,
	scriptLang: VueScriptLang,
	componentName: string,
) => {
	const isTs = scriptLang === VueScriptLang.typeScript;
	const optionsTemplate = generateOptionsApiScriptTemplate(
		componentName,
		isTs,
		_configHelper,
	);
	const setupTemplate = generateCompositionApiScriptTemplate(
		isTs,
		_configHelper,
	);
	return (
		`<script ${isSetupApi ? "setup " : ""}lang='${scriptLang}'>` +
		`\n` +
		`${!isSetupApi ? optionsTemplate : setupTemplate}` +
		`</script>` +
		`\n\n` +
		`${isSetupApi ? generateInheritAttrs(scriptLang) : ``}`
	);
};

const generateInheritAttrs = (scriptLang: VueScriptLang) => {
	if (!_configHelper.options.showInheritAttrs()) return ``;
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

const generateTemplate = () => {
	return (
		`<template>` +
		`\n` +
		ind() +
		`<div>` +
		`\n` +
		generateTemplateVModel() +
		ind() +
		`</div>` +
		`\n` +
		`</template>` +
		`\n\n`
	);
};

const generateTemplateVModel = () => {
	if (!_configHelper.showVModelTemplate()) return "";
	return ind(2) + `<input v-model="value" />` + `\n`;
};

const generateStyleContent = (styleLang: VueStyleLang, scoped: boolean) => {
	return (
		`<style ${scoped ? "scoped " : ""}lang="${styleLang}">` + `\n` + `</style>`
	);
};
