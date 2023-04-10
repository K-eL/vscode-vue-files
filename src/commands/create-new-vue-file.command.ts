
import * as vscode from 'vscode';
import { requestStringDialog } from '../helpers/editor-helper';
import { createFile, handleVueFileName, getVueFileContent, isFileNameValid } from '../helpers/file-helper';
import { VueApiType } from '../enums/vue-api-type.enum';
import { FileSettings } from '../interfaces/file-settings';
import { VueStyleLang } from '../enums/vue-style-lang.enum';

const templateCursorPosition = new vscode.Position(2, 5);
const scriptCursorPosition = new vscode.Position(14, 5);

export const createNewVueFileCommand = async (uri: any, apiType: VueApiType, scriptLang: VueScriptLang, styleLang: VueStyleLang) => {
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
	const componentName = fileName.replace('.vue', '');

	// get config for script first
	const config = vscode.workspace.getConfiguration('vscode-vue-files');
	const isScriptFirst = config.get('template.script-comes-first') as boolean;

	const newFileSettings: FileSettings = {
		isSetupApi: apiType === VueApiType.setup,
		isScriptFirst,
		scriptLang,
		styleLang,
		componentName
	};

	// define the file content
	const fileContent = getVueFileContent(newFileSettings);

	// if uri contains a file, use the parent folder
	if (uri.fsPath.includes('.')) {
		uri = uri.with({ path: uri.path.replace(uri.fsPath.split('/').pop() as string, '') });
	}
	// define the new file uri
	const newFileUri = uri.with({ path: `${uri.path}/${fileName}` });

	// create the new file
	await createFile(newFileUri, fileContent);

	// open the new file
	const document = await vscode.workspace.openTextDocument(newFileUri);
	const editor = await vscode.window.showTextDocument(document, 1, false);

	// position the cursor at the correct position
	isScriptFirst ?
		editor.selection = new vscode.Selection(scriptCursorPosition, scriptCursorPosition) :
		editor.selection = new vscode.Selection(templateCursorPosition, templateCursorPosition);
};