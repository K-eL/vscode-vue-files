
import * as vscode from 'vscode';
import { requestStringDialog } from '../helpers/editor-helper';
import { createFile, handleVueFileName, isFileNameValid, openFile } from '../helpers/file-helper';
import { VueApiType } from '../enums/vue-api-type.enum';
import { FileSettings } from '../interfaces/file-settings';
import { VueStyleLang } from '../enums/vue-style-lang.enum';
import { VueScriptLang } from '../enums/vue-script-lang.enum';
import { generateContent } from '../generators/content.generator';
import { isScriptFirst, loadWorkspaceConfig } from '../helpers/config.helper';

const templateCursorPosition = new vscode.Position(2, 2);
const scriptCursorPosition = new vscode.Position(2, 0);

export const createNewVueFileCommand = async (uri: any, apiType: VueApiType, scriptLang: VueScriptLang, styleLang: VueStyleLang) => {
	// loads/updates workspace config
	loadWorkspaceConfig();

	// get file name from user input
	let stringInput = await requestStringDialog(
		'Enter the name of the new component file',
		'MyComponent',
		isFileNameValid
	);

	// return if no file name was entered
	if (!stringInput) { return; }

	// handle file name
	const fileName = handleVueFileName(stringInput);
	// handle component name
	const componentName = fileName.replace('.vue', '').split('-').map((word) => {
		return word.charAt(0).toUpperCase() + word.slice(1);
	}).join('');

	const newFileSettings: FileSettings = {
		isSetupApi: apiType === VueApiType.setup,
		scriptLang,
		styleLang,
		componentName
	};

	// define the file content
	const fileContent = generateContent(newFileSettings);

	// if uri contains a file, use the parent folder
	if (uri.fsPath.includes('.')) {
		uri = uri.with({ path: uri.path.replace(uri.fsPath.split('/').pop() as string, '') });
	}
	// define the new file uri
	const newFileUri = uri.with({ path: `${uri.path}/${fileName}` });

	// create the new file
	await createFile(newFileUri, fileContent);

	// open the new file
	const cursorPosition = isScriptFirst() ? scriptCursorPosition : templateCursorPosition;
	await openFile(newFileUri, cursorPosition);
};