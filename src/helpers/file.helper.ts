/**
 * @fileoverview Generic file utilities for workspace operations.
 * Provides functions for creating, validating, and opening files.
 *
 * @module helpers/file
 */
import * as vscode from "vscode";
import { TextEncoder } from "util";

/**
 * Creates a file in the workspace with the specified content.
 *
 * @param uri - The URI where the file should be created
 * @param fileContent - The content to write to the file
 * @returns Promise that resolves when file is written
 *
 * @example
 * ```typescript
 * const uri = vscode.Uri.file("/path/to/Component.vue");
 * await createFile(uri, "<template>...</template>");
 * ```
 */
export const createFile = async (
	uri: vscode.Uri,
	fileContent: string,
): Promise<void> => {
	const encoder = new TextEncoder();
	const encodedContent = encoder.encode(fileContent);
	await vscode.workspace.fs.writeFile(uri, encodedContent);
};

/**
 * Validates whether a file name contains only allowed characters.
 * Allowed: word characters, hyphens, periods, spaces, underscores.
 *
 * @param fileName - The file name to validate
 * @returns RegExpMatchArray if valid, null otherwise
 *
 * @example
 * ```typescript
 * isFileNameValid("MyComponent")    // truthy
 * isFileNameValid("my-component")   // truthy
 * isFileNameValid("invalid/name")   // null (invalid)
 * isFileNameValid("<script>")       // null (invalid)
 * ```
 */
export const isFileNameValid = (fileName: string): RegExpMatchArray | null => {
	// This pattern matches a filename that contains one or more word characters,
	// hyphens, periods, spaces, or underscores.
	return fileName.trim().match(/^[\w\-. ]+$/);
};

/**
 * Opens a file in the VS Code editor at the specified cursor position.
 *
 * @param uri - The URI of the file to open
 * @param cursorPosition - Optional position to place the cursor (defaults to 0,0)
 *
 * @example
 * ```typescript
 * const uri = vscode.Uri.file("/path/to/Component.vue");
 * await openFile(uri); // Opens at line 1, column 1
 * await openFile(uri, new vscode.Position(10, 0)); // Opens at line 11
 * ```
 */
export const openFile = async (
	uri: vscode.Uri,
	cursorPosition?: vscode.Position,
): Promise<void> => {
	const document = await vscode.workspace.openTextDocument(uri);
	const editor = await vscode.window.showTextDocument(document, 1, false);
	cursorPosition = cursorPosition || new vscode.Position(0, 0);
	editor.selection = new vscode.Selection(cursorPosition, cursorPosition);
};
