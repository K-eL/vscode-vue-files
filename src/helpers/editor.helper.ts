/**
 * @fileoverview Editor utilities for user input and interaction.
 * Provides functions for showing dialogs and collecting user input.
 *
 * @module helpers/editor
 */
import * as vscode from "vscode";
import { isFileNameValid } from "./file.helper";

/**
 * Shows an input dialog to request a string from the user.
 * Validates input to ensure it's a valid file name.
 *
 * @param prompt - The message shown above the input box
 * @param placeHolder - Placeholder text shown in the input box
 * @returns The trimmed user input, or undefined if cancelled
 *
 * @example
 * ```typescript
 * const name = await requestStringDialog(
 *   "Enter component name",
 *   "e.g., MyComponent"
 * );
 * if (name) {
 *   // User entered a valid name
 * }
 * ```
 */
export const requestStringDialog = async (
	prompt: string,
	placeHolder: string,
): Promise<string | undefined> => {
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
