/**
 * @fileoverview Service for creating Vue composable files.
 * Contains all business logic for composable creation, separated from UI concerns.
 *
 * @module services/composable
 */
import * as path from "path";
import * as fs from "fs";
import { ComposablePattern } from "../enums/composable-pattern.enum";
import { generateComposable } from "../generators/composable.generator";
import { ConfigHelper } from "../helpers/config.helper";
import {
	ensureDirectoryExists,
	fileExists,
} from "../helpers/target-directory.helper";
import type { CreateComposableResult } from "../interfaces/service-result";

/**
 * Options for creating a composable file
 */
export interface CreateComposableOptions {
	/** Raw name entered by user */
	name: string;
	/** Selected composable pattern */
	pattern: ComposablePattern;
	/** Target directory for file creation */
	targetDirectory: string;
	/** Whether to overwrite if file exists */
	overwriteExisting?: boolean;
}

/**
 * Service class for composable file operations
 */
export class ComposableService {
	private config: ConfigHelper;

	constructor(config?: ConfigHelper) {
		this.config = config ?? ConfigHelper.getInstance();
	}

	/**
	 * Creates a new composable file
	 */
	async create(options: CreateComposableOptions): Promise<CreateComposableResult> {
		try {
			const { name, pattern, targetDirectory, overwriteExisting = false } = options;

			// Normalize name and determine file details
			const normalizedName = this.normalizeName(name);
			const useTypeScript = this.config.composables.useTypeScript();
			const extension = useTypeScript ? "ts" : "js";
			const fileName = `${normalizedName}.${extension}`;
			const filePath = path.join(targetDirectory, fileName);

			// Check if file exists
			const fileExisted = fileExists(filePath);
			if (fileExisted && !overwriteExisting) {
				return {
					success: false,
					fileName,
					filePath,
					fileExisted: true,
					error: `File "${fileName}" already exists`,
				};
			}

			// Ensure directory exists
			if (!ensureDirectoryExists(targetDirectory)) {
				return {
					success: false,
					error: "Failed to create directory",
				};
			}

			// Generate content
			const content = generateComposable({
				name: name.trim(),
				pattern,
				useGenerics: useTypeScript,
			});

			// Write file
			fs.writeFileSync(filePath, content, "utf8");

			return {
				success: true,
				filePath,
				fileName,
				fileExisted,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	}

	/**
	 * Normalizes composable name to standard format (useXxx)
	 */
	normalizeName(name: string): string {
		const trimmed = name.trim();
		// If already starts with 'use', normalize casing
		if (trimmed.toLowerCase().startsWith("use")) {
			return "use" + trimmed.slice(3).charAt(0).toUpperCase() + trimmed.slice(4);
		}
		// Add 'use' prefix
		return "use" + trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
	}

	/**
	 * Validates a composable name
	 * @returns Error message if invalid, undefined if valid
	 */
	validateName(name: string): string | undefined {
		if (!name || name.trim().length === 0) {
			return "Composable name is required";
		}
		// Remove 'use' prefix for validation
		const nameWithoutPrefix = name.trim().replace(/^use/i, "");
		if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(nameWithoutPrefix)) {
			return "Composable name must start with a letter and contain only alphanumeric characters";
		}
		return undefined;
	}

	/**
	 * Gets the target directory for composable creation
	 */
	getTargetDirectoryOptions() {
		return {
			createSubdirectory: this.config.composables.createInComposablesFolder(),
			subdirectoryName: "composables",
			subdirectoryAliases: ["composable"],
		};
	}

	/**
	 * Gets whether TypeScript should be used
	 */
	useTypeScript(): boolean {
		return this.config.composables.useTypeScript();
	}
}

// Export singleton instance for convenience
export const composableService = new ComposableService();
