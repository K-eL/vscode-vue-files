import * as vscode from "vscode";
import { VueApiType } from "../enums/vue-api-type.enum";
import { VueScriptLang } from "../enums/vue-script-lang.enum";
import { VueStyleLang } from "../enums/vue-style-lang.enum";
import { generateContent } from "../generators/content.generator";
import { createFile } from "../helpers/file.helper";
import { FileSettings } from "../interfaces/file-settings";
import { ConfigHelper } from "../helpers/config.helper";

const templateCursorPosition = new vscode.Position(2, 5);
const scriptCursorPosition = new vscode.Position(14, 5);

export const createFilesForTestCommand = async (uri: vscode.Uri) => {
	// loads/updates workspace config
	const configHelper = new ConfigHelper();

	// if uri contains a file, use the parent folder
	if (uri.fsPath.includes(".")) {
		uri = uri.with({
			path: uri.path.replace(uri.fsPath.split("/").pop() as string, ""),
		});
	}

	let n = 1;
	for (const apiType of Object.values(VueApiType)) {
		for (const scriptLang of Object.values(VueScriptLang)) {
			for (const styleLang of Object.values(VueStyleLang)) {
				const newFileSettings: FileSettings = {
					isSetupApi: VueApiType[apiType] === VueApiType.setup,
					scriptLang,
					styleLang,
					componentName: "MyComponent" + n,
				};
				const fileContent = generateContent(newFileSettings, configHelper);
				// define the new file uri
				const newFileUri = uri.with({
					path: `${uri.path}/${apiType + scriptLang + styleLang}.vue`,
				});
				// create the new file
				await createFile(newFileUri, fileContent);
				// open the new file
				const document = await vscode.workspace.openTextDocument(newFileUri);
				const editor = await vscode.window.showTextDocument(document, 1, false);

				// position the cursor at the correct position
				const position = configHelper.isScriptFirst()
					? scriptCursorPosition
					: templateCursorPosition;
				editor.selection = new vscode.Selection(position, position);

				n++;
			}
		}
	}
};
