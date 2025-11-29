/**
 * @fileoverview Barrel export for test __helpers__
 * Import all test utilities from this single entry point
 *
 * @example
 * ```typescript
 * import {
 *   createTestConfigHelper,
 *   createVueComponentSettings,
 *   VueComponentSettingsPresets,
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

export {
	mockShowInputBox,
	mockShowQuickPick,
	mockShowInformationMessage,
	mockShowErrorMessage,
	mockShowWarningMessage,
	mockOpenTextDocument,
	mockShowTextDocument,
	createMockWorkspaceFolders,
	type MockWorkspaceFolder,
} from "./mocks/vscode.mock";

// Factories
export {
	createVueComponentSettings,
	createCompositionApiSettings,
	createOptionsApiSettings,
	VueComponentSettingsPresets,
	DEFAULT_VUE_COMPONENT_SETTINGS,
} from "./factories/vue-component-settings.factory";

export {
	createTestConfigHelper,
	createMinimalConfigHelper,
	createFullFeaturedConfigHelper,
	ConfigHelperPresets,
	type ConfigHelperFactoryOptions,
} from "./factories/config.factory";

// Sinon setup
export {
	chai,
	sinon,
	assertCalled,
	assertCalledOnce,
	assertCalledWith,
	assertNotCalled,
} from "./sinon-setup";
