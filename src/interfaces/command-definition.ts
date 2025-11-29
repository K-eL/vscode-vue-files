import * as vscode from "vscode";

/**
 * Definition for a VS Code command registration.
 * Provides a declarative way to define commands for the extension.
 *
 * @example
 * ```typescript
 * const command: CommandDefinition = {
 *   id: "vscode-vue-files.createPiniaStore",
 *   handler: (uri) => createPiniaStoreCommand(uri),
 * };
 * ```
 */
export interface CommandDefinition {
	/**
	 * Command ID as defined in package.json.
	 * Must match the "command" field in the contributes.commands array.
	 */
	id: string;

	/**
	 * Command handler function.
	 * Receives optional uri and context parameters from VS Code.
	 */
	handler: (
		uri?: vscode.Uri,
		context?: vscode.ExtensionContext,
	) => Promise<void> | void;

	/**
	 * Whether this command requires the ExtensionContext.
	 * If true, the context will be passed as the second argument.
	 * @default false
	 */
	needsContext?: boolean;
}
