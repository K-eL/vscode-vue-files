import { FileSettings } from "../interfaces/file-settings";
import { VueScriptLang } from '../enums/vue-script-lang.enum';
import { VueStyleLang } from '../enums/vue-style-lang.enum';
import { generateOptionsApiScriptTemplate } from "./options-script.generator";
import { generateCompositionApiScriptTemplate } from "./composition-script.generator";
import { isScriptFirst, showInheritAttrsScriptOption, showVModelTemplate } from "../helpers/config.helper";

export const generateContent = (fileSettings: FileSettings) => {
	return isScriptFirst() ?
		generateContentScriptFirst(fileSettings) :
		generateContentTemplateFirst(fileSettings);
};

const generateContentScriptFirst = (fileSettings: FileSettings) => {
	const { isSetupApi, scriptLang, styleLang, componentName } = fileSettings;
	return generateScriptContent(isSetupApi, scriptLang, componentName) +
		generateTemplate() +
		generateStyleContent(styleLang, true);
};

const generateContentTemplateFirst = (fileSettings: FileSettings) => {
	const { isSetupApi, scriptLang, styleLang, componentName } = fileSettings;
	return generateTemplate() +
		generateScriptContent(isSetupApi, scriptLang, componentName) +
		generateStyleContent(styleLang, true);
};

const generateScriptContent = (isSetupApi: boolean, scriptLang: VueScriptLang, componentName: string) => {
	const isTs = scriptLang === VueScriptLang.typeScript;
	const optionsTemplate = generateOptionsApiScriptTemplate(componentName, isTs);
	const setupTemplate = generateCompositionApiScriptTemplate(isTs);
	return `<script ${isSetupApi ? 'setup ' : ''}lang='${scriptLang}'>` + `\n` +
		`${!isSetupApi ? optionsTemplate : setupTemplate}` +
		`</script>` + `\n\n` +
		`${isSetupApi ? generateInheritAttrs(scriptLang) : ``}`;
};

const generateInheritAttrs = (scriptLang: VueScriptLang) => {
	if (!showInheritAttrsScriptOption()) return ``;
	return `<script lang='${scriptLang}'>` + `\n` +
		`\t` + `export default {` + `\n` +
		`\t\t` + `inheritAttrs: false,` + `\n` +
		`\t` + `};` + `\n` +
		`</script>` + `\n\n`;
};

const generateTemplate = () => {
	return `<template>` + `\n` +
		`\t` + `<div>` + `\n` +
		generateTemplateVModel() +
		`\t` + `</div>` + `\n` +
		`</template>` + `\n\n`;
};

const generateTemplateVModel = () => {
	if (!showVModelTemplate()) return '';
	return `\t\t` + `<input v-model="value" />` + `\n`;
};

const generateStyleContent = (styleLang: VueStyleLang, scoped: boolean) => {
	return `<style ${scoped ? 'scoped ' : ''}lang="${styleLang}">` + `\n` +
		`</style>`;
};