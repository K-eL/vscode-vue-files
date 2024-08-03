import * as vscode from "vscode";
import { isFileNameValid } from "./file.helper";

export const requestStringDialog = async (
	prompt: string,
	placeHolder: string,
) => {
	const input = await vscode.window.showInputBox({
		prompt,
		placeHolder,
		validateInput: (value: string) => {
			if (!isFileNameValid(value)) {
				return "Invalid input";
			}
			return null;
		},
	});
	return input?.trim();
};
