import * as vscode from 'vscode';
import { TextEncoder } from 'util';
import { FileSettings } from '../interfaces/file-settings';

export const handleVueFileName = (fileName: string) => {
	// trim file name
	fileName = fileName.trim();
	// replace spaces with dashes
	fileName = fileName.replace(/ /g, '-');
	// add extension if not present
	if (fileName.indexOf('.vue') === -1) {
		fileName += '.vue';
	}
	return fileName;
};

export const createFile = async (uri: vscode.Uri, fileContent: string) => {
	const encoder = new TextEncoder();
	const encodedContent = encoder.encode(fileContent);
	const file = await vscode.workspace.fs.writeFile(uri, encodedContent);
	return file;
};

export const getVueFileContent = (fileSettings: FileSettings) => {
	const { isScriptFirst } = fileSettings;
	return isScriptFirst ?
		getVueFileContentScriptFirst(fileSettings) :
		getVueFileContentTemplateFirst(fileSettings);
};

const getVueFileContentScriptFirst = (fileSettings: FileSettings) => {
	const { isSetupApi, scriptLang, styleLang, componentName } = fileSettings;
	return getVueFileScriptContent(isSetupApi, scriptLang, componentName) +
		getVueFileTemplateContent() +
		getVueFileStyleContent(styleLang, true);
};

const getVueFileContentTemplateFirst = (fileSettings: FileSettings) => {
	const { isSetupApi, scriptLang, styleLang, componentName } = fileSettings;
	return getVueFileTemplateContent() +
		getVueFileScriptContent(isSetupApi, scriptLang, componentName) +
		getVueFileStyleContent(styleLang, true);
};

const getVueFileTemplateContent = () => {
	return `<template>` + `\n` +
		`\t` + `<div>` + `\n` +
		`\t\t\n` +
		`\t` + `</div>` + `\n` +
		`</template>` + `\n\n`;
};

const getVueFileScriptContent = (isSetupApi: boolean, scriptLang: string, componentName: string) => {
	const optionsTemplate = getOptionsApiScriptTemplate(componentName);
	const setupTemplate = getSetupApiScriptTemplate();
	return `<script ${isSetupApi ? 'setup ' : ''}lang='${scriptLang}'>` + `\n` +
		`${!isSetupApi ? optionsTemplate : setupTemplate}` +
		`</script>` + `\n\n`;
};

const getSetupApiScriptTemplate = () => {
	return `import { onMounted } from 'vue'` + `\n\n` +
		`defineProps({` + `\n` +
		`});` + `\n\n` +
		`onMounted(() => {` + `\n` +
		`\t` + `//` + `\n` +
		`});` + `\n\n`;
};

const getOptionsApiScriptTemplate = (componentName: string) => {
	return `import { defineComponent } from 'vue'` + `\n\n` +
		`export default defineComponent({` + `\n` +
		`\t` + `name: '${componentName}',` + `\n` +
		`\t` + `props: {` + `\n` +
		`\t` + `},` + `\n` +
		`\t` + `data() {` + `\n` +
		`\t\t` + `return {` + `\n` +
		`\t\t` + `};` + `\n` +
		`\t` + `},` + `\n` +
		`\t` + `methods: {` + `\n` +
		`\t` + `},` + `\n` +
		`});` + `\n`;
};

const getVueFileStyleContent = (styleLang: string, scoped: boolean) => {
	return `<style ${scoped ? 'scoped ' : ''}lang="${styleLang}">` + `\n` +
		`</style>`;
};

export const isFileNameValid = (fileName: string) => {
	// This pattern matches a filename that contains one or more word characters, 
	// hyphens, periods, spaces, or underscores. It does not allow other 
	// special characters, such as slashes or colons, that are not valid in 
	// filenames on most operating systems.
	return fileName.trim().match(/^[\w\-. ]+$/);
};