/**
 * @fileoverview Vue-specific file utilities.
 * Provides functions for handling Vue file names and paths.
 *
 * @module helpers/vue-file
 */

/**
 * Normalizes a Vue file name by trimming whitespace, replacing spaces
 * with dashes, and ensuring it has a `.vue` extension.
 *
 * @param fileName - The raw file name input from the user
 * @returns Normalized file name with `.vue` extension
 *
 * @example
 * ```typescript
 * handleVueFileName("My Component")   // "My-Component.vue"
 * handleVueFileName("test.vue")       // "test.vue"
 * handleVueFileName("  Button  ")     // "Button.vue"
 * ```
 */
export const handleVueFileName = (fileName: string): string => {
	// trim file name
	fileName = fileName.trim();
	// replace spaces with dashes
	fileName = fileName.replace(/ /g, "-");
	// add extension if not present
	if (!fileName.toLowerCase().endsWith(".vue")) {
		fileName += ".vue";
	}
	return fileName;
};
