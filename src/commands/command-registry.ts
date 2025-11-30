/**
 * @fileoverview Command Registry for vscode-vue-files extension.
 * Provides a declarative way to define and register all extension commands.
 *
 * @module commands/command-registry
 */
import * as vscode from "vscode";
import { CommandDefinition } from "../interfaces/command-definition";
import { createVueComponentCommand } from "./create-vue-component.command";
import { createVueComponentQuickCommand } from "./create-vue-component-quick.command";
import { createPiniaStoreCommand } from "./create-pinia-store.command";
import { createComposableCommand } from "./create-composable.command";
import { createFilesForTestCommand } from "./create-files-for-test.command";
import { VueApiType } from "../enums/vue-api-type.enum";
import { VueScriptLang } from "../enums/vue-script-lang.enum";
import { VueStyleLang } from "../enums/vue-style-lang.enum";

/**
 * All commands registered by the vscode-vue-files extension.
 * Each command definition maps a command ID to its handler function.
 */
export const commandDefinitions: CommandDefinition[] = [
	// =========================================================================
	// Quick Pick Command (recommended way to create files)
	// =========================================================================
	{
		id: "vscode-vue-files.createVueComponentQuick",
		handler: (uri, context) => createVueComponentQuickCommand(uri, context!),
		needsContext: true,
	},

	// =========================================================================
	// Composition API (setup) Commands
	// =========================================================================
	{
		id: "vscode-vue-files.vueSetupTsScss",
		handler: (uri) =>
			createVueComponentCommand(
				uri!,
				VueApiType.setup,
				VueScriptLang.typeScript,
				VueStyleLang.scss,
			),
	},
	{
		id: "vscode-vue-files.vueSetupTsCss",
		handler: (uri) =>
			createVueComponentCommand(
				uri!,
				VueApiType.setup,
				VueScriptLang.typeScript,
				VueStyleLang.css,
			),
	},
	{
		id: "vscode-vue-files.vueSetupJsScss",
		handler: (uri) =>
			createVueComponentCommand(
				uri!,
				VueApiType.setup,
				VueScriptLang.javaScript,
				VueStyleLang.scss,
			),
	},
	{
		id: "vscode-vue-files.vueSetupJsCss",
		handler: (uri) =>
			createVueComponentCommand(
				uri!,
				VueApiType.setup,
				VueScriptLang.javaScript,
				VueStyleLang.css,
			),
	},

	// =========================================================================
	// Options API Commands
	// =========================================================================
	{
		id: "vscode-vue-files.vueOptionsTsScss",
		handler: (uri) =>
			createVueComponentCommand(
				uri!,
				VueApiType.options,
				VueScriptLang.typeScript,
				VueStyleLang.scss,
			),
	},
	{
		id: "vscode-vue-files.vueOptionsTsCss",
		handler: (uri) =>
			createVueComponentCommand(
				uri!,
				VueApiType.options,
				VueScriptLang.typeScript,
				VueStyleLang.css,
			),
	},
	{
		id: "vscode-vue-files.vueOptionsJsScss",
		handler: (uri) =>
			createVueComponentCommand(
				uri!,
				VueApiType.options,
				VueScriptLang.javaScript,
				VueStyleLang.scss,
			),
	},
	{
		id: "vscode-vue-files.vueOptionsJsCss",
		handler: (uri) =>
			createVueComponentCommand(
				uri!,
				VueApiType.options,
				VueScriptLang.javaScript,
				VueStyleLang.css,
			),
	},

	// =========================================================================
	// Pinia & Composables Commands
	// =========================================================================
	{
		id: "vscode-vue-files.createPiniaStore",
		handler: (uri) => createPiniaStoreCommand(uri),
	},
	{
		id: "vscode-vue-files.createComposable",
		handler: (uri) => createComposableCommand(uri),
	},

	// =========================================================================
	// Development/Testing Commands
	// =========================================================================
	{
		id: "vscode-vue-files.devEnvTest",
		handler: (uri) => createFilesForTestCommand(uri!),
	},
];

/**
 * Registers all extension commands with VS Code.
 * Should be called once during extension activation.
 *
 * @param context - The extension context for managing subscriptions
 *
 * @example
 * ```typescript
 * export function activate(context: vscode.ExtensionContext) {
 *   registerAllCommands(context);
 * }
 * ```
 */
export function registerAllCommands(context: vscode.ExtensionContext): void {
	for (const command of commandDefinitions) {
		const disposable = vscode.commands.registerCommand(
			command.id,
			async (uri?: vscode.Uri) => {
				if (command.needsContext) {
					await command.handler(uri, context);
				} else {
					await command.handler(uri);
				}
			},
		);
		context.subscriptions.push(disposable);
	}
}

/**
 * Gets the total number of registered commands.
 * Useful for testing and debugging.
 */
export function getCommandCount(): number {
	return commandDefinitions.length;
}
