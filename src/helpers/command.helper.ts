/**
 * @fileoverview Command utilities for common command operations.
 * Provides reusable functions for file creation commands including
 * opening files, handling conflicts, and error formatting.
 *
 * @module helpers/command
 */
import * as vscode from "vscode";
import type { FileCreationResult } from "../interfaces/service-result";

/**
 * Alias for backward compatibility and clearer semantics in commands
 */
export type ServiceResult = FileCreationResult;

/**
 * Options for opening a created file
 */
export interface OpenFileOptions {
	/** Message to show on success (optional) */
	successMessage?: string;
	/** Cursor position to place after opening (optional) */
	cursorPosition?: vscode.Position;
}

/**
 * Opens a created file in the editor with optional cursor positioning and success message.
 *
 * @param filePath - Absolute path to the file to open
 * @param options - Optional configuration for opening the file
 *
 * @example
 * ```typescript
 * // Simple open
 * await openCreatedFile('/path/to/file.ts');
 *
 * // With success message
 * await openCreatedFile('/path/to/file.ts', {
 *   successMessage: 'Component "MyComponent" created successfully!'
 * });
 *
 * // With cursor position
 * await openCreatedFile('/path/to/file.vue', {
 *   cursorPosition: new vscode.Position(2, 2)
 * });
 * ```
 */
export async function openCreatedFile(
	filePath: string,
	options: OpenFileOptions = {},
): Promise<void> {
	const { successMessage, cursorPosition } = options;

	const document = await vscode.workspace.openTextDocument(filePath);

	if (cursorPosition) {
		await vscode.window.showTextDocument(document, {
			selection: new vscode.Selection(cursorPosition, cursorPosition),
		});
	} else {
		await vscode.window.showTextDocument(document);
	}

	if (successMessage) {
		vscode.window.showInformationMessage(successMessage);
	}
}

/**
 * Handles the "file already exists" conflict scenario.
 * Shows a warning dialog and optionally retries with overwrite flag.
 *
 * @param result - The service result indicating file exists
 * @param retryFn - Function to call if user chooses to overwrite
 * @param entityName - Name of the entity type for display (e.g., "composable", "store")
 * @returns The retry result if user chose to overwrite, undefined otherwise
 *
 * @example
 * ```typescript
 * if (!result.success && result.fileExisted) {
 *   const retryResult = await handleFileExistsConflict(
 *     result,
 *     () => service.create({ ...options, overwriteExisting: true }),
 *     'composable'
 *   );
 *   if (retryResult?.success) {
 *     await openCreatedFile(retryResult.filePath!);
 *   }
 *   return;
 * }
 * ```
 */
export async function handleFileExistsConflict<T extends ServiceResult>(
	result: T,
	retryFn: () => Promise<T>,
	entityName: string,
): Promise<T | undefined> {
	const overwrite = await vscode.window.showWarningMessage(
		`File "${result.fileName}" already exists. Overwrite?`,
		"Yes",
		"No",
	);

	if (overwrite !== "Yes") {
		return undefined;
	}

	const retryResult = await retryFn();

	if (!retryResult.success) {
		vscode.window.showErrorMessage(
			`Failed to create ${entityName}: ${retryResult.error}`,
		);
	}

	return retryResult;
}

/**
 * Formats an error into a user-friendly message.
 *
 * @param error - The error to format (can be Error or unknown)
 * @param context - Context description for the error (e.g., "create composable")
 * @returns Formatted error message string
 *
 * @example
 * ```typescript
 * try {
 *   // operation
 * } catch (error) {
 *   vscode.window.showErrorMessage(formatErrorMessage(error, 'create composable'));
 * }
 * ```
 */
export function formatErrorMessage(error: unknown, context: string): string {
	const message =
		error instanceof Error ? error.message : "Unknown error occurred";
	return `Failed to ${context}: ${message}`;
}

/**
 * Shows an error message for a failed service operation.
 *
 * @param result - The failed service result
 * @param entityName - Name of the entity type for display
 */
export function showServiceError(result: ServiceResult, entityName: string): void {
	vscode.window.showErrorMessage(
		`Failed to create ${entityName}: ${result.error}`,
	);
}

/**
 * Handles the complete file creation result flow:
 * - If file exists, prompts for overwrite
 * - If error, shows error message
 * - If success, opens file and shows success message
 *
 * @param result - The service result
 * @param retryFn - Function to call for retry with overwrite
 * @param entityName - Name of entity for messages
 * @param openOptions - Options for opening the file
 * @returns true if file was created/opened successfully
 */
export async function handleCreateResult<T extends ServiceResult>(
	result: T,
	retryFn: () => Promise<T>,
	entityName: string,
	openOptions: OpenFileOptions = {},
): Promise<boolean> {
	// Handle file already exists
	if (!result.success && result.fileExisted) {
		const retryResult = await handleFileExistsConflict(result, retryFn, entityName);
		if (retryResult?.success && retryResult.filePath) {
			await openCreatedFile(retryResult.filePath, {
				...openOptions,
				successMessage: openOptions.successMessage ?? 
					`${capitalizeFirst(entityName)} "${retryResult.fileName}" created successfully!`,
			});
			return true;
		}
		return false;
	}

	// Handle other errors
	if (!result.success) {
		showServiceError(result, entityName);
		return false;
	}

	// Success - open the file
	await openCreatedFile(result.filePath!, {
		...openOptions,
		successMessage: openOptions.successMessage ?? 
			`${capitalizeFirst(entityName)} "${result.fileName}" created successfully!`,
	});
	return true;
}

/**
 * Capitalizes the first letter of a string
 */
function capitalizeFirst(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
