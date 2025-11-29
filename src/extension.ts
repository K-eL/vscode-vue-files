/**
 * @fileoverview Extension entry point for vscode-vue-files.
 * Handles activation and deactivation of the extension.
 *
 * @module extension
 */
import * as vscode from "vscode";
import { registerAllCommands } from "./commands/command-registry";

/**
 * Called when the extension is activated.
 * The extension is activated the first time a command is executed.
 *
 * @param context - The extension context provided by VS Code
 */
export function activate(context: vscode.ExtensionContext): void {
	registerAllCommands(context);
}

/**
 * Called when the extension is deactivated.
 * Use this to clean up any resources if needed.
 */
export function deactivate(): void {
	// Nothing to clean up
}
