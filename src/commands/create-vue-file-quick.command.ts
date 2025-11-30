import * as vscode from "vscode";
import { ConfigHelper } from "../helpers/config.helper";
import { QuickPickHelper } from "../helpers/quick-pick.helper";
import { getTargetDirectory } from "../helpers/directory.helper";
import { handleCreateResult, formatErrorMessage } from "../helpers/command.helper";
import { VueFileService, vueFileService } from "../services/vue-file.service";

const templateCursorPosition = new vscode.Position(2, 2);
const scriptCursorPosition = new vscode.Position(2, 0);

/**
 * Creates a new Vue file using Quick Pick interface with recently used templates
 * @param uri The uri of the file or folder (can be undefined when called from command palette)
 * @param context The extension context for storing recent templates
 * @param service The Vue file service (injectable for testing)
 */
export const createVueFileQuickCommand = async (
	uri: vscode.Uri | undefined,
	context: vscode.ExtensionContext,
	service: VueFileService = vueFileService,
) => {
	const configHelper = ConfigHelper.getInstance();

	try {
		// Show quick pick for template selection
		const quickPickHelper = new QuickPickHelper(context);
		const selectedTemplate = await quickPickHelper.showTemplateQuickPick();

		if (!selectedTemplate) {
			return; // User cancelled
		}


    // Get target directory options from service
    const targetDirOptions = service.getTargetDirectoryOptions();

		// Determine target directory
		const targetDir = await getTargetDirectory(uri, targetDirOptions);
		if (!targetDir) {
			return;
		}

		// Get file name from user input
		const componentName = await vscode.window.showInputBox({
			prompt: "Enter the name of the new component file",
			placeHolder: "MyComponent",
			validateInput: (value) => service.validateName(value),
		});
		if (!componentName) {
			return;
		}

		// Create file using service
		const result = await service.create({
			componentName,
			targetDirectory: targetDir,
			apiType: selectedTemplate.apiType,
			scriptLang: selectedTemplate.scriptLang,
			styleLang: selectedTemplate.styleLang,
		});

		// Get cursor position based on config
		const cursorPosition = configHelper.isScriptFirst() ? scriptCursorPosition : templateCursorPosition;

		// Handle result (file exists, errors, success) using shared helper
		await handleCreateResult(
			result,
			() => service.create({
				componentName,
				targetDirectory: targetDir,
				apiType: selectedTemplate.apiType,
				scriptLang: selectedTemplate.scriptLang,
				styleLang: selectedTemplate.styleLang,
				overwriteExisting: true,
			}),
			'component',
			{ cursorPosition }
		);
	} catch (error) {
		vscode.window.showErrorMessage(formatErrorMessage(error, 'create component'));
	}
};
