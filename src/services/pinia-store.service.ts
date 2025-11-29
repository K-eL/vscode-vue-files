/**
 * @fileoverview Service for creating Pinia store files.
 * Contains all business logic for store creation, separated from UI concerns.
 *
 * @module services/pinia-store
 */
import * as path from "path";
import * as fs from "fs";
import { PiniaStoreType } from "../enums/pinia-store-type.enum";
import { generatePiniaStore } from "../generators/pinia-store.generator";
import { ConfigHelper } from "../helpers/config.helper";
import {
	ensureDirectoryExists,
	fileExists,
} from "../helpers/target-directory.helper";
import type { CreatePiniaStoreResult } from "../interfaces/service-result";

/**
 * Options for creating a Pinia store file
 */
export interface CreatePiniaStoreOptions {
	/** Raw name entered by user */
	name: string;
	/** Store type (setup or options) */
	storeType: PiniaStoreType;
	/** Target directory for file creation */
	targetDirectory: string;
	/** Whether to use TypeScript (defaults to config) */
	useTypeScript?: boolean;
	/** Whether to overwrite if file exists */
	overwriteExisting?: boolean;
}

/**
 * Service class for Pinia store file operations
 */
export class PiniaStoreService {
	private config: ConfigHelper;

	constructor(config?: ConfigHelper) {
		this.config = config ?? ConfigHelper.getInstance();
	}

	/**
	 * Creates a new Pinia store file
	 */
	async create(options: CreatePiniaStoreOptions): Promise<CreatePiniaStoreResult> {
		try {
			const { name, storeType, targetDirectory, overwriteExisting = false } = options;

			// Normalize name and determine file details
			const normalizedName = this.normalizeFileName(name);
			const useTypeScript = options.useTypeScript ?? true; // Default to TypeScript
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
			const content = generatePiniaStore({
				name: this.normalizeStoreName(name),
				type: storeType,
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
	 * Normalizes store name for file (e.g., "user" -> "user.store")
	 */
	normalizeFileName(name: string): string {
		const trimmed = name.trim().toLowerCase();
		// Remove .store suffix if present
		const baseName = trimmed.replace(/\.store$/i, "");
		return `${baseName}.store`;
	}

	/**
	 * Normalizes store name for the defineStore call (e.g., "user" -> "user")
	 */
	normalizeStoreName(name: string): string {
		const trimmed = name.trim().toLowerCase();
		// Remove .store suffix if present
		return trimmed.replace(/\.store$/i, "");
	}

	/**
	 * Gets the store ID for defineStore (e.g., "user" -> "user")
	 */
	getStoreId(name: string): string {
		return this.normalizeStoreName(name);
	}

	/**
	 * Validates a store name
	 * @returns Error message if invalid, undefined if valid
	 */
	validateName(name: string): string | undefined {
		if (!name || name.trim().length === 0) {
			return "Store name is required";
		}
		const cleanName = name.trim().replace(/\.store$/i, "");
		if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(cleanName)) {
			return "Store name must start with a letter and contain only alphanumeric characters, hyphens, or underscores";
		}
		return undefined;
	}

	/**
	 * Gets the target directory options for store creation
	 */
	getTargetDirectoryOptions() {
		return {
			createSubdirectory: this.config.pinia.createInStoresFolder(),
			subdirectoryName: "stores",
			subdirectoryAliases: ["store"],
		};
	}

	/**
	 * Gets store type options for quick pick
	 */
	getStoreTypeOptions(): Array<{ label: string; description: string; value: PiniaStoreType }> {
		return [
			{
				label: "Setup Store",
				description: "Uses setup function with ref, computed, function (recommended)",
				value: PiniaStoreType.setup,
			},
			{
				label: "Options Store",
				description: "Uses object with state, getters, actions",
				value: PiniaStoreType.options,
			},
		];
	}
}

// Export singleton instance for convenience
export const piniaStoreService = new PiniaStoreService();
