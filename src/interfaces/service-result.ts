/**
 * @fileoverview Common interfaces for service operation results.
 * Provides a consistent structure for all service operations.
 *
 * @module interfaces/service-result
 */

/**
 * Base result interface for file creation operations.
 * Used by all services to provide consistent operation results.
 */
export interface FileCreationResult {
	/** Whether the operation was successful */
	success: boolean;
	/** Full path to created file */
	filePath?: string;
	/** File name (without path) */
	fileName?: string;
	/** Error message if operation failed */
	error?: string;
	/** Whether file already existed before operation */
	fileExisted?: boolean;
}

/**
 * Result type alias for composable creation
 * @see FileCreationResult
 */
export type CreateComposableResult = FileCreationResult;

/**
 * Result type alias for Pinia store creation
 * @see FileCreationResult
 */
export type CreatePiniaStoreResult = FileCreationResult;

/**
 * Result type alias for Vue Component creation
 * @see FileCreationResult
 */
export type CreateVueComponentResult = FileCreationResult;
