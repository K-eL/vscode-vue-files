import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { requestStringDialog } from "../helpers/input-dialog.helper";
import { createFile, openFile } from "../helpers/file.helper";
import { handleVueFileName } from "../helpers/vue-file.helper";
import { VueComponentSettings } from "../interfaces/vue-component-settings";
import { generateVueSfcContent } from "../generators/vue-sfc.generator";
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
export const createVueFileQuickCommand = async (
	uri: vscode.Uri | undefined,
	context: vscode.ExtensionContext,
) => {
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

	// loads/updates workspace config
	const configHelper = ConfigHelper.getInstance();

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
		.replace(/[-_](.)/g, (_: string, char: string) => char.toUpperCase())
		.replace(/^(.)/g, (_: string, char: string) => char.toUpperCase());

	// create file settings
	const fileSettings: VueComponentSettings = {
		apiType: selectedTemplate.apiType,
		scriptLang: selectedTemplate.scriptLang,
		styleLang: selectedTemplate.styleLang,
		componentName: componentName,
	};

	// create file content
	const fileContent = generateVueSfcContent(fileSettings, configHelper);

	// create file path
	const filePath = vscode.Uri.joinPath(targetUri, fileName);

	// create file
	await createFile(filePath, fileContent);

	// determine cursor position
	const cursorPosition = configHelper.isScriptFirst()
		? scriptCursorPosition
		: templateCursorPosition;

	// open the new file in the editor
	await openFile(filePath, cursorPosition);
};

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
