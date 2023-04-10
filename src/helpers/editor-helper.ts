import * as vscode from 'vscode';

export const requestStringDialog = async (prompt: string, placeHolder: string, isValidFn: Function) => {
	let input = await vscode.window.showInputBox({
		prompt,
		placeHolder,
		validateInput: (value: string) => {
			if (!isValidFn(value)) {
				return 'Invalid input';
			}
			return null;
		}
	});
	return input?.trim();
};