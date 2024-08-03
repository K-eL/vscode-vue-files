import * as vscode from "vscode";
import { TextEncoder } from "util";

export const handleVueFileName = (fileName: string) => {
	// trim file name
	fileName = fileName.trim();
	// replace spaces with dashes
	fileName = fileName.replace(/ /g, "-");
	// add extension if not present
	if (!fileName.toLowerCase().endsWith(".vue")) {
		fileName += ".vue";
	}
	return fileName;
};

export const createFile = async (uri: vscode.Uri, fileContent: string) => {
	const encoder = new TextEncoder();
	const encodedContent = encoder.encode(fileContent);
	const file = await vscode.workspace.fs.writeFile(uri, encodedContent);
	return file;
};

export const isFileNameValid = (fileName: string) => {
	// This pattern matches a filename that contains one or more word characters,
	// hyphens, periods, spaces, or underscores.
	return fileName.trim().match(/^[\w\-. ]+$/);
};

export const openFile = async (
	uri: vscode.Uri,
	cursorPosition?: vscode.Position,
) => {
	const document = await vscode.workspace.openTextDocument(uri);
	const editor = await vscode.window.showTextDocument(document, 1, false);
	cursorPosition = cursorPosition || new vscode.Position(0, 0);
	editor.selection = new vscode.Selection(cursorPosition, cursorPosition);
};
