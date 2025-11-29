/**
 * @fileoverview Barrel export for test __helpers__
 * Import all test utilities from this single entry point
 *
 * @example
 * ```typescript
 * import {
 *   createTestConfigHelper,
 *   createFileSettings,
 *   FileSettingsPresets,
 *   ConfigHelperPresets,
 * } from "../../__helpers__";
 * ```
 */

// Mocks
export {
	createVueFilesConfigMock,
	createEditorConfigMock,
	DEFAULT_CONFIG_VALUES,
	DEFAULT_EDITOR_CONFIG,
} from "./mocks/config.mock";

// Factories
export {
	createFileSettings,
	createCompositionApiSettings,
	createOptionsApiSettings,
	FileSettingsPresets,
	DEFAULT_FILE_SETTINGS,
} from "./factories/file-settings.factory";

export {
	createTestConfigHelper,
	createMinimalConfigHelper,
	createFullFeaturedConfigHelper,
	ConfigHelperPresets,
	type ConfigHelperFactoryOptions,
} from "./factories/config.factory";
