/**
 * @fileoverview Target directory resolution utilities.
 * Provides shared logic for determining target directories for file creation.
 *
 * @module helpers/target-directory
 */
import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

/**
 * Options for resolving target directory
 */
export interface TargetDirectoryOptions {
	/** Whether to create a subdirectory for the files */
	createSubdirectory: boolean;
	/** Name of the subdirectory to create (e.g., 'composables', 'stores') */
	subdirectoryName: string;
	/** Alternative names that indicate we're already in the right folder */
	subdirectoryAliases?: string[];
}

/**
 * Result of target directory resolution
 */
export interface TargetDirectoryResult {
	/** The resolved directory path, or undefined if resolution failed */
	path: string | undefined;
	/** Error message if resolution failed */
	error?: string;
}

/**
 * Determines the base directory from a URI or workspace
 * @param uri - Optional URI from context menu
 * @returns Base directory path or undefined with error
 */
export function getBaseDirectory(
	uri: vscode.Uri | undefined,
): TargetDirectoryResult {
	if (uri) {
		// Use provided URI (from context menu)
		try {
			const stat = fs.statSync(uri.fsPath);
			const basePath = stat.isDirectory()
				? uri.fsPath
				: path.dirname(uri.fsPath);
			return { path: basePath };
		} catch {
			return { path: undefined, error: "Failed to access the provided path" };
		}
	}

	// No URI provided, try to use workspace folder
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders || workspaceFolders.length === 0) {
		return { path: undefined, error: "No workspace folder open" };
	}

	// Use first workspace folder's src directory if it exists
	const workspaceRoot = workspaceFolders[0].uri.fsPath;
	const srcDir = path.join(workspaceRoot, "src");
	const basePath = fs.existsSync(srcDir) ? srcDir : workspaceRoot;

	return { path: basePath };
}

/**
 * Determines the target directory for file creation with optional subdirectory
 *
 * @param uri - Optional URI from context menu click
 * @param options - Configuration for subdirectory handling
 * @returns Promise resolving to the target directory path or undefined
 *
 * @example
 * ```typescript
 * const targetDir = await getTargetDirectory(uri, {
 *   createSubdirectory: true,
 *   subdirectoryName: 'composables',
 *   subdirectoryAliases: ['composable']
 * });
 * ```
 */
export async function getTargetDirectory(
	uri: vscode.Uri | undefined,
	options: TargetDirectoryOptions,
): Promise<string | undefined> {
	const baseResult = getBaseDirectory(uri);

	if (!baseResult.path) {
		if (baseResult.error) {
			vscode.window.showErrorMessage(baseResult.error);
		}
		return undefined;
	}

	const baseDir = baseResult.path;

	// Check if we should create in a subdirectory
	if (options.createSubdirectory) {
		const isInSubdirectory = checkIfInSubdirectory(baseDir, options);
		if (!isInSubdirectory) {
			return path.join(baseDir, options.subdirectoryName);
		}
	}

	return baseDir;
}

/**
 * Checks if the base directory is already a target subdirectory
 * @internal Exported for testing
 */
export function checkIfInSubdirectory(
	baseDir: string,
	options: TargetDirectoryOptions,
): boolean {
	const baseName = path.basename(baseDir).toLowerCase();
	const targetName = options.subdirectoryName.toLowerCase();
	const aliases = options.subdirectoryAliases?.map((a) => a.toLowerCase()) || [];

	return baseName === targetName || aliases.includes(baseName);
}

/**
 * Ensures a directory exists, creating it recursively if needed
 *
 * @param dirPath - The directory path to ensure exists
 * @returns true if directory exists or was created, false on error
 */
export function ensureDirectoryExists(dirPath: string): boolean {
	try {
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
		return true;
	} catch {
		return false;
	}
}

/**
 * Checks if a file exists at the given path
 *
 * @param filePath - The file path to check
 * @returns true if file exists
 */
export function fileExists(filePath: string): boolean {
	return fs.existsSync(filePath);
}
