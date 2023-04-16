// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createNewVueFileCommand } from './commands/create-new-vue-file.command';
import { VueStyleLang } from './enums/vue-style-lang.enum';
import { VueApiType } from './enums/vue-api-type.enum';
import { VueScriptLang } from './enums/vue-script-lang.enum';
import { createFilesForTestCommand } from './commands/create-files-for-test.command';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate (_context: vscode.ExtensionContext) {
	vscode.commands.registerCommand('vscode-vue-files.vueSetupTsScss', async (uri) => createNewVueFileCommand(uri, VueApiType.setup, VueScriptLang.typeScript, VueStyleLang.scss));
	vscode.commands.registerCommand('vscode-vue-files.vueSetupTsCss', async (uri) => createNewVueFileCommand(uri, VueApiType.setup, VueScriptLang.typeScript, VueStyleLang.css));
	vscode.commands.registerCommand('vscode-vue-files.vueSetupJsScss', async (uri) => createNewVueFileCommand(uri, VueApiType.setup, VueScriptLang.javaScript, VueStyleLang.scss));
	vscode.commands.registerCommand('vscode-vue-files.vueSetupJsCss', async (uri) => createNewVueFileCommand(uri, VueApiType.setup, VueScriptLang.javaScript, VueStyleLang.css));
	vscode.commands.registerCommand('vscode-vue-files.vueOptionsTsScss', async (uri) => createNewVueFileCommand(uri, VueApiType.options, VueScriptLang.typeScript, VueStyleLang.scss));
	vscode.commands.registerCommand('vscode-vue-files.vueOptionsTsCss', async (uri) => createNewVueFileCommand(uri, VueApiType.options, VueScriptLang.typeScript, VueStyleLang.css));
	vscode.commands.registerCommand('vscode-vue-files.vueOptionsJsScss', async (uri) => createNewVueFileCommand(uri, VueApiType.options, VueScriptLang.javaScript, VueStyleLang.scss));
	vscode.commands.registerCommand('vscode-vue-files.vueOptionsJsCss', async (uri) => createNewVueFileCommand(uri, VueApiType.options, VueScriptLang.javaScript, VueStyleLang.css));
	vscode.commands.registerCommand('vscode-vue-files.devEnvTest', async (uri) => createFilesForTestCommand(uri));
}

// This method is called when your extension is deactivated
export function deactivate () { }
