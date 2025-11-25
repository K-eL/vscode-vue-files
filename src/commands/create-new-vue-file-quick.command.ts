import * as vscode from "vscode";
import { requestStringDialog } from "../helpers/editor.helper";
import {
	createFile,
	handleVueFileName,
	openFile,
} from "../helpers/file.helper";
import { VueApiType } from "../enums/vue-api-type.enum";
import { FileSettings } from "../interfaces/file-settings";
import { generateContent } from "../generators/content.generator";
import { ConfigHelper } from "../helpers/config.helper";
import { QuickPickHelper } from "../helpers/quick-pick.helper";

const templateCursorPosition = new vscode.Position(2, 2);
const scriptCursorPosition = new vscode.Position(2, 0);

/**
 * Creates a new Vue file using Quick Pick interface with recently used templates
 * @param uri The uri of the file. It can be either a file or a folder
 * @param context The extension context for storing recent templates
 * @returns
 */
export const createNewVueFileQuickCommand = async (
	uri: vscode.Uri,
	context: vscode.ExtensionContext,
) => {
	// Show quick pick for template selection
	const quickPickHelper = new QuickPickHelper(context);
	const selectedTemplate = await quickPickHelper.showTemplateQuickPick();

	if (!selectedTemplate) {
		return; // User cancelled
	}

	// loads/updates workspace config
	const configHelper = new ConfigHelper();

	// get file name from user input
	const stringInput = await requestStringDialog(
		"Enter the name of the new component file",
		"MyComponent",
	);

	// return if no file name was entered
	if (!stringInput) {
		return;
	}

	// handle file name
	const fileName = handleVueFileName(stringInput);
	// handle component name
	const componentName = fileName
		.split("/")
		.pop()!
		.replace(".vue", "")
		.replace(/[-_](.)/g, (_, char) => char.toUpperCase())
		.replace(/^(.)/, (_, char) => char.toUpperCase());

	// create file settings
	const fileSettings: FileSettings = {
		isSetupApi: selectedTemplate.apiType === VueApiType.setup,
		scriptLang: selectedTemplate.scriptLang,
		styleLang: selectedTemplate.styleLang,
		componentName: componentName,
	};

	// create file content
	const fileContent = generateContent(fileSettings, configHelper);

	// create file path
	const filePath = vscode.Uri.joinPath(uri, fileName);

	// create file
	await createFile(filePath, fileContent);

	// determine cursor position
	const cursorPosition = configHelper.isScriptFirst()
		? scriptCursorPosition
		: templateCursorPosition;

	// open the new file in the editor
	await openFile(filePath, cursorPosition);
};
