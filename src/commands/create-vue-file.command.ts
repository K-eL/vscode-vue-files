import * as vscode from "vscode";
import { requestStringDialog } from "../helpers/input-dialog.helper";
import { createFile, openFile } from "../helpers/file.helper";
import { handleVueFileName } from "../helpers/vue-file.helper";
import { VueApiType } from "../enums/vue-api-type.enum";
import { VueComponentSettings } from "../interfaces/vue-component-settings";
import { VueStyleLang } from "../enums/vue-style-lang.enum";
import { VueScriptLang } from "../enums/vue-script-lang.enum";
import { generateVueSfcContent } from "../generators/vue-sfc.generator";
import { ConfigHelper } from "../helpers/config.helper";

const templateCursorPosition = new vscode.Position(2, 2);
const scriptCursorPosition = new vscode.Position(2, 0);

/**
 * Creates a new Vue file. It asks for the component name and creates the file. The cursor position is then determined and the file is finally opened in the editor.
 * @param uri The uri of the file. It can be either a file or a folder
 * @param apiType The type of the api. It can be either setup or options
 * @param scriptLang The language of the script. It can be either TypeScript or JavaScript
 * @param styleLang The language of the style. It can be either CSS, SCSS
 * @returns
 */

export const createVueFileCommand = async (
	uri: vscode.Uri,
	apiType: VueApiType,
	scriptLang: VueScriptLang,
	styleLang: VueStyleLang,
) => {
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
		.replace(".vue", "")
		.split("-")
		.map((word: string) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join("");

	const newFileSettings: VueComponentSettings = {
		apiType,
		scriptLang,
		styleLang,
		componentName,
	};

	// define the file content
	const fileContent = generateVueSfcContent(newFileSettings, configHelper);

	// if uri contains a file, use the parent folder
	if (uri.fsPath.includes(".")) {
		uri = uri.with({
			path: uri.path.replace(uri.fsPath.split("/").pop() as string, ""),
		});
	}
	// define the new file uri
	const newFileUri = uri.with({ path: `${uri.path}/${fileName}` });

	// create the new file
	await createFile(newFileUri, fileContent);

	// open the new file
	const cursorPosition = configHelper.isScriptFirst()
		? scriptCursorPosition
		: templateCursorPosition;
	await openFile(newFileUri, cursorPosition);
};
