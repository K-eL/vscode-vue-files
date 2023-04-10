// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createNewVueFileCommand } from './commands/create-new-vue-file.command';
import { VueStyleLang } from './enums/vue-style-lang.enum';
import { VueApiType } from './enums/vue-api-type.enum';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate (_context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('vscode-vue-files.vue-setup-ts-scss', async (uri) => createNewVueFileCommand(uri, VueApiType.setup, VueScriptLang.typeScript, VueStyleLang.scss));
	vscode.commands.registerCommand('vscode-vue-files.vue-setup-ts-css', async (uri) => createNewVueFileCommand(uri, VueApiType.setup, VueScriptLang.typeScript, VueStyleLang.css));
	vscode.commands.registerCommand('vscode-vue-files.vue-setup-js-scss', async (uri) => createNewVueFileCommand(uri, VueApiType.setup, VueScriptLang.javaScript, VueStyleLang.scss));
	vscode.commands.registerCommand('vscode-vue-files.vue-setup-js-css', async (uri) => createNewVueFileCommand(uri, VueApiType.setup, VueScriptLang.javaScript, VueStyleLang.css));
	vscode.commands.registerCommand('vscode-vue-files.vue-options-ts-scss', async (uri) => createNewVueFileCommand(uri, VueApiType.options, VueScriptLang.typeScript, VueStyleLang.scss));
	vscode.commands.registerCommand('vscode-vue-files.vue-options-ts-css', async (uri) => createNewVueFileCommand(uri, VueApiType.options, VueScriptLang.typeScript, VueStyleLang.css));
	vscode.commands.registerCommand('vscode-vue-files.vue-options-js-scss', async (uri) => createNewVueFileCommand(uri, VueApiType.options, VueScriptLang.javaScript, VueStyleLang.scss));
	vscode.commands.registerCommand('vscode-vue-files.vue-options-js-css', async (uri) => createNewVueFileCommand(uri, VueApiType.options, VueScriptLang.javaScript, VueStyleLang.css));
}

// This method is called when your extension is deactivated
export function deactivate () { }
