import * as vscode from "vscode";
import * as path from "path";
import { VueApiType } from "../enums/vue-api-type.enum";
import { VueStyleLang } from "../enums/vue-style-lang.enum";
import { VueScriptLang } from "../enums/vue-script-lang.enum";
import { ConfigHelper } from "../helpers/config.helper";
import { handleCreateResult, formatErrorMessage } from "../helpers/command.helper";
import { VueFileService, vueFileService } from "../services/vue-file.service";

const templateCursorPosition = new vscode.Position(2, 2);
const scriptCursorPosition = new vscode.Position(2, 0);

/**
 * Creates a new Vue file with specific API type, script language, and style language.
 * This command is called from the context menu with predefined options.
 * @param uri The uri of the file or folder
 * @param apiType The type of the api (setup or options)
 * @param scriptLang The language of the script (TypeScript or JavaScript)
 * @param styleLang The language of the style (CSS, SCSS)
 * @param service The Vue file service (injectable for testing)
 */
export const createVueFileCommand = async (
	uri: vscode.Uri,
	apiType: VueApiType,
	scriptLang: VueScriptLang,
	styleLang: VueStyleLang,
	service: VueFileService = vueFileService,
) => {
	const configHelper = ConfigHelper.getInstance();

	try {
		// Get file name from user input
		const componentName = await vscode.window.showInputBox({
			prompt: "Enter the name of the new component file",
			placeHolder: "MyComponent",
			validateInput: (value) => service.validateName(value),
		});

		if (!componentName) {
			return;
		}

		// Resolve target directory (if uri is a file, use parent folder)
		let targetDirectory = uri.fsPath;
		if (uri.fsPath.includes(".")) {
			targetDirectory = path.dirname(uri.fsPath);
		}

		// Create file using service
		const result = await service.create({
			componentName,
			targetDirectory,
			apiType,
			scriptLang,
			styleLang,
		});

		// Get cursor position based on config
		const cursorPosition = configHelper.isScriptFirst() ? scriptCursorPosition : templateCursorPosition;

		// Handle result (file exists, errors, success) using shared helper
		await handleCreateResult(
			result,
			() => service.create({
				componentName,
				targetDirectory,
				apiType,
				scriptLang,
				styleLang,
				overwriteExisting: true,
			}),
			'component',
			{ cursorPosition }
		);
	} catch (error) {
		vscode.window.showErrorMessage(formatErrorMessage(error, 'create component'));
	}
};
