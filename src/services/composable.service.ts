/**
 * @fileoverview Service for creating Vue composable files.
 * Contains all business logic for composable creation, separated from UI concerns.
 *
 * @module services/composable
 */
import { ComposablePattern } from "../enums/composable-pattern.enum";
import { generateComposable } from "../generators/composable.generator";
import { ConfigHelper } from "../helpers/config.helper";
import { BaseFileService, type TargetDirConfig } from "./base-file.service";
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
export class ComposableService extends BaseFileService {
	constructor(config?: ConfigHelper) {
		super(config);
	}

	/**
	 * Creates a new composable file
	 */
	async create(options: CreateComposableOptions): Promise<CreateComposableResult> {
		const { name, pattern, targetDirectory, overwriteExisting = false } = options;

		// Normalize name and determine file details
		const normalizedName = this.normalizeComposableName(name);
		const useTypeScript = this.config.composables.useTypeScript();
		const extension = useTypeScript ? "ts" : "js";
		const fileName = `${normalizedName}.${extension}`;

		return this.createFile(
			fileName,
			targetDirectory,
			() => generateComposable({
				name: name.trim(),
				pattern,
				useGenerics: useTypeScript,
			}),
			overwriteExisting,
		);
	}

	/**
	 * Normalizes composable name to standard format (useXxx)
	 */
	normalizeComposableName(name: string): string {
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
		const emptyError = this.validateNotEmpty(name, "Composable");
		if (emptyError) return emptyError;

		// Remove 'use' prefix for validation
		const nameWithoutPrefix = name.trim().replace(/^use/i, "");
		return this.validatePattern(
			nameWithoutPrefix,
			/^[a-zA-Z][a-zA-Z0-9]*$/,
			"Composable name must start with a letter and contain only alphanumeric characters",
		);
	}

	/**
	 * Gets the target directory options for composable creation
	 */
	getTargetDirectoryOptions(): TargetDirConfig {
		return {
			createSubdirectory: this.config.composables.createInComposablesFolder(),
			subdirectoryName: "composables",
			subdirectoryAliases: ["composable"],
		};
	}
}

// Export singleton instance for convenience
export const composableService = new ComposableService()