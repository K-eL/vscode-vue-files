/**
 * @fileoverview Service for creating Pinia store files.
 * Contains all business logic for store creation, separated from UI concerns.
 *
 * @module services/pinia-store
 */
import { PiniaStoreType } from "../enums/pinia-store-type.enum";
import { generatePiniaStore } from "../generators/pinia-store.generator";
import { ConfigHelper } from "../helpers/config.helper";
import { BaseFileService, type TargetDirConfig } from "./base-file.service";
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
export class PiniaStoreService extends BaseFileService {
	constructor(config?: ConfigHelper) {
		super(config);
	}

	/**
	 * Creates a new Pinia store file
	 */
	async create(options: CreatePiniaStoreOptions): Promise<CreatePiniaStoreResult> {
		const { name, storeType, targetDirectory, overwriteExisting = false } = options;

		// Normalize name and determine file details
		const normalizedName = this.normalizePiniaStoreFileName(name);
		const useTypeScript = options.useTypeScript ?? true; // Default to TypeScript
		const extension = useTypeScript ? "ts" : "js";
		const fileName = `${normalizedName}.${extension}`;

		return this.createFile(
			fileName,
			targetDirectory,
			() => generatePiniaStore({
				name: this.normalizePiniaStoreName(name),
				type: storeType,
			}),
			overwriteExisting,
		);
	}

	/**
	 * Normalizes store name for file (e.g., "user" -> "user.store")
	 */
	normalizePiniaStoreFileName(name: string): string {
		const trimmed = name.trim().toLowerCase();
		// Remove .store suffix if present
		const baseName = trimmed.replace(/\.store$/i, "");
		return `${baseName}.store`;
	}

	/**
	 * Normalizes store name for the defineStore call (e.g., "user" -> "user")
	 */
	normalizePiniaStoreName(name: string): string {
		const trimmed = name.trim().toLowerCase();
		// Remove .store suffix if present
		return trimmed.replace(/\.store$/i, "");
	}

	/**
	 * Validates a store name
	 * @returns Error message if invalid, undefined if valid
	 */
	validateName(name: string): string | undefined {
		const emptyError = this.validateNotEmpty(name, "Store");
		if (emptyError) return emptyError;

		const cleanName = name.trim().replace(/\.store$/i, "");
		return this.validatePattern(
			cleanName,
			/^[a-zA-Z][a-zA-Z0-9_-]*$/,
			"Store name must start with a letter and contain only alphanumeric characters, hyphens, or underscores",
		);
	}

	/**
	 * Gets the target directory options for store creation
	 */
	getTargetDirectoryOptions(): TargetDirConfig {
		return {
			createSubdirectory: this.config.pinia.createInStoresFolder(),
			subdirectoryName: "stores",
			subdirectoryAliases: ["store"],
		};
	}
}

// Export singleton instance for convenience
export const piniaStoreService = new PiniaStoreService();
