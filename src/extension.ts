/**
 * @fileoverview Extension entry point for vscode-vue-files.
 * Handles activation and deactivation of the extension.
 *
 * @module extension
 */
import * as vscode from "vscode";
import { registerAllCommands } from "./commands/command-registry";
import { ConfigHelper } from "./helpers/config.helper";

/**
 * Called when the extension is activated.
 * The extension is activated the first time a command is executed.
 *
 * @param context - The extension context provided by VS Code
 */
export function activate(context: vscode.ExtensionContext): void {
	registerAllCommands(context);

	// Listen for configuration changes and refresh ConfigHelper
	const configChangeListener = vscode.workspace.onDidChangeConfiguration(
		(event: vscode.ConfigurationChangeEvent) => {
			// Check if our extension's settings or editor settings changed
			if (
				event.affectsConfiguration("vscode-vue-files") ||
				event.affectsConfiguration("editor.tabSize") ||
				event.affectsConfiguration("editor.insertSpaces")
			) {
				ConfigHelper.refresh();
			}
		},
	);

	// Register the listener for proper cleanup
	context.subscriptions.push(configChangeListener);
}

/**
 * Called when the extension is deactivated.
 * Use this to clean up any resources if needed.
 */
export function deactivate(): void {
	// Nothing to clean up
}
