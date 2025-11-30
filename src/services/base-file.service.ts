/**
 * @fileoverview Base service class for file creation operations.
 * Provides common functionality shared across all file creation services.
 *
 * @module services/base-file
 */
import * as fs from "fs";
import * as path from "path";
import { ConfigHelper } from "../helpers/config.helper";
import { ensureDirectoryExists } from "../helpers/directory.helper";
import type { FileCreationResult } from "../interfaces/service-result";

/**
 * Base options interface for all file creation operations
 */
export interface BaseCreateOptions {
	/** Target directory for file creation */
	targetDirectory: string;
	/** Whether to overwrite if file exists */
	overwriteExisting?: boolean;
}

/**
 * Configuration for target directory resolution
 */
export interface TargetDirConfig {
	/** Whether to create files in a subdirectory */
	createSubdirectory: boolean;
	/** Name of the subdirectory (e.g., 'composables', 'stores') */
	subdirectoryName: string;
	/** Alternative directory names that indicate we're already in the right folder */
	subdirectoryAliases?: string[];
}

/**
 * Abstract base class for file creation services.
 * Provides common functionality for:
 * - File existence checking
 * - Directory creation
 * - File writing
 * - Name validation pattern
 */
export abstract class BaseFileService {
	protected config: ConfigHelper;

	constructor(config?: ConfigHelper) {
		this.config = config ?? ConfigHelper.getInstance();
	}

	/**
	 * Validates a name for the entity being created.
	 * Must be implemented by each service with specific validation rules.
	 *
	 * @param name - The name to validate
	 * @returns Error message if invalid, undefined if valid
	 */
	abstract validateName(name: string): string | undefined;

	/**
	 * Gets the target directory options for file creation.
	 * Must be implemented by each service with specific directory configuration.
	 */
	abstract getTargetDirectoryOptions(): TargetDirConfig;

	/**
	 * Checks if a file exists and returns an error result if it does and overwrite is not allowed.
	 *
	 * @param filePath - Full path to the file
	 * @param fileName - Name of the file (for error message)
	 * @param overwriteExisting - Whether to allow overwriting
	 * @returns Error result if file exists and can't overwrite, null otherwise
	 */
	protected checkFileExists(
		filePath: string,
		fileName: string,
		overwriteExisting: boolean,
	): FileCreationResult | null {
		const fileExisted = fs.existsSync(filePath);
		if (fileExisted && !overwriteExisting) {
			return {
				success: false,
				fileName,
				filePath,
				fileExisted: true,
				error: `File "${fileName}" already exists`,
			};
		}
		return null;
	}

	/**
	 * Writes content to a file, ensuring the directory exists.
	 *
	 * @param filePath - Full path to the file
	 * @param fileName - Name of the file
	 * @param content - Content to write
	 * @param targetDirectory - Directory to ensure exists
	 * @returns Success or error result
	 */
	protected writeFile(
		filePath: string,
		fileName: string,
		content: string,
		targetDirectory: string,
	): FileCreationResult {
		// Ensure directory exists
		if (!ensureDirectoryExists(targetDirectory)) {
			return {
				success: false,
				error: "Failed to create directory",
			};
		}

		// Write file
		fs.writeFileSync(filePath, content, "utf8");

		return {
			success: true,
			filePath,
			fileName,
			fileExisted: fs.existsSync(filePath),
		};
	}

	/**
	 * Common file creation flow with existence check and directory creation.
	 *
	 * @param fileName - Name of the file to create
	 * @param targetDirectory - Target directory path
	 * @param contentGenerator - Function that generates the file content
	 * @param overwriteExisting - Whether to overwrite existing file
	 * @returns File creation result
	 */
	protected async createFile(
		fileName: string,
		targetDirectory: string,
		contentGenerator: () => string,
		overwriteExisting = false,
	): Promise<FileCreationResult> {
		try {
			const filePath = path.join(targetDirectory, fileName);

			// Check if file exists
			const existsResult = this.checkFileExists(filePath, fileName, overwriteExisting);
			if (existsResult) {
				return existsResult;
			}

			// Generate content
			const content = contentGenerator();

			// Write file
			return this.writeFile(filePath, fileName, content, targetDirectory);
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}

	/**
	 * Validates that a name is not empty.
	 *
	 * @param name - The name to validate
	 * @param entityType - Type of entity for error message (e.g., "Composable", "Store")
	 * @returns Error message if empty, undefined otherwise
	 */
	protected validateNotEmpty(name: string, entityType: string): string | undefined {
		if (!name || name.trim().length === 0) {
			return `${entityType} name is required`;
		}
		return undefined;
	}

	/**
	 * Validates that a name matches an alphanumeric pattern.
	 *
	 * @param name - The name to validate
	 * @param pattern - Regex pattern to match
	 * @param errorMessage - Error message if pattern doesn't match
	 * @returns Error message if invalid, undefined otherwise
	 */
	protected validatePattern(
		name: string,
		pattern: RegExp,
		errorMessage: string,
	): string | undefined {
		if (!pattern.test(name)) {
			return errorMessage;
		}
		return undefined;
	}
}
