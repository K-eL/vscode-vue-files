import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { ConfigHelper } from "../helpers/config.helper";
import { QuickPickHelper } from "../helpers/quick-pick.helper";
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

	// Show quick pick for template selection
	const quickPickHelper = new QuickPickHelper(context);
	const selectedTemplate = await quickPickHelper.showTemplateQuickPick();

	if (!selectedTemplate) {
		return; // User cancelled
	}

	// Resolve target URI (handle undefined uri from command palette)
	const targetUri = await resolveTargetUri(uri);
	if (!targetUri) {
		return; // User cancelled or no valid folder
	}

	// Get file name from user input
	const componentName = await vscode.window.showInputBox({
		prompt: "Enter the name of the new component file",
		placeHolder: "MyComponent",
		validateInput: (value) => service.validateComponentName(value),
	});

	if (!componentName) {
		return;
	}

	// Create file using service
	const result = await service.create({
		componentName,
		targetDirectory: targetUri.fsPath,
		apiType: selectedTemplate.apiType,
		scriptLang: selectedTemplate.scriptLang,
		styleLang: selectedTemplate.styleLang,
	});

	// Handle file already exists
	if (!result.success && result.fileExisted) {
		const overwrite = await vscode.window.showWarningMessage(
			`File "${result.fileName}" already exists. Overwrite?`,
			"Yes",
			"No",
		);
		if (overwrite === "Yes") {
			const retryResult = await service.create({
				componentName,
				targetDirectory: targetUri.fsPath,
				apiType: selectedTemplate.apiType,
				scriptLang: selectedTemplate.scriptLang,
				styleLang: selectedTemplate.styleLang,
				overwriteExisting: true,
			});
			if (retryResult.success && retryResult.filePath) {
				await openCreatedFile(retryResult.filePath, configHelper);
			} else {
				vscode.window.showErrorMessage(`Failed to create component: ${retryResult.error}`);
			}
		}
		return;
	}

	// Handle other errors
	if (!result.success) {
		vscode.window.showErrorMessage(`Failed to create component: ${result.error}`);
		return;
	}

	// Open the created file
	await openCreatedFile(result.filePath!, configHelper);
};

/**
 * Opens the created file in the editor with cursor at appropriate position
 */
async function openCreatedFile(filePath: string, config: ConfigHelper): Promise<void> {
	const document = await vscode.workspace.openTextDocument(filePath);
	const cursorPosition = config.isScriptFirst() ? scriptCursorPosition : templateCursorPosition;
	await vscode.window.showTextDocument(document, {
		selection: new vscode.Selection(cursorPosition, cursorPosition),
	});
}

/**
 * Resolves the target URI for file creation
 * If uri is undefined (e.g., from command palette), prompts user to select a folder
 */
async function resolveTargetUri(
	uri: vscode.Uri | undefined,
): Promise<vscode.Uri | undefined> {
	if (uri) {
		// Check if it's a file, get parent directory
		try {
			const stat = await vscode.workspace.fs.stat(uri);
			if (stat.type === vscode.FileType.File) {
				return vscode.Uri.file(path.dirname(uri.fsPath));
			}
			return uri;
		} catch {
			return uri;
		}
	}

	// No URI provided, try to resolve from workspace
	const workspaceFolders = vscode.workspace.workspaceFolders;
	
	if (!workspaceFolders || workspaceFolders.length === 0) {
		// No workspace open, ask user to select a folder
		const selectedFolders = await vscode.window.showOpenDialog({
			canSelectFiles: false,
			canSelectFolders: true,
			canSelectMany: false,
			openLabel: "Select folder for new file",
			title: "Select Target Folder",
		});

		if (!selectedFolders || selectedFolders.length === 0) {
			return undefined;
		}

		return selectedFolders[0];
	}

	// Single workspace folder - use src if exists, otherwise root
	if (workspaceFolders.length === 1) {
		const workspaceRoot = workspaceFolders[0].uri.fsPath;
		const srcDir = path.join(workspaceRoot, "src");
		
		if (fs.existsSync(srcDir)) {
			return vscode.Uri.file(srcDir);
		}
		return workspaceFolders[0].uri;
	}

	// Multiple workspace folders - let user choose
	const folderItems = workspaceFolders.map((folder) => ({
		label: folder.name,
		description: folder.uri.fsPath,
		uri: folder.uri,
	}));

	const selectedFolder = await vscode.window.showQuickPick(folderItems, {
		placeHolder: "Select workspace folder for new file",
		title: "Select Target Folder",
	});

	if (!selectedFolder) {
		return undefined;
	}

	// Check for src directory in selected folder
	const srcDir = path.join(selectedFolder.uri.fsPath, "src");
	if (fs.existsSync(srcDir)) {
		return vscode.Uri.file(srcDir);
	}

	return selectedFolder.uri;
}
