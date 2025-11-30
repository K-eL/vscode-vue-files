/**
 * @fileoverview Factory for creating ConfigHelper instances for testing
 */
import { ConfigHelper } from "../../../src/helpers/config.helper";
import {
	createExtensionConfigMock,
	createEditorConfigMock,
} from "../mocks/config.mock";

/**
 * Options for creating a test ConfigHelper
 */
export interface ConfigHelperFactoryOptions {
	/** Override vscode-vue-files configuration values */
	configOverrides?: Record<string, unknown>;
	/** Override editor configuration values */
	editorOverrides?: Record<string, unknown>;
}

/**
 * Creates a ConfigHelper instance with mocked configurations for testing.
 * Automatically registers the mock with ConfigHelper singleton.
 *
 * @param options - Configuration options for the mock
 * @returns ConfigHelper instance with mocked internal configs
 *
 * @example
 * ```typescript
 * // In beforeEach
 * const config = createTestConfigHelper({
 *   configOverrides: {
 *     "scriptSetup.useDefineModel": true,
 *   },
 * });
 *
 * // In afterEach
 * ConfigHelper._resetForTesting();
 * ```
 */
export function createTestConfigHelper(
	options: ConfigHelperFactoryOptions = {},
): ConfigHelper {
	const { configOverrides = {}, editorOverrides = {} } = options;

	const configHelper = new ConfigHelper();

	// Inject mocked configurations
	// Using bracket notation to access private members for testing
	configHelper["_extensionConfig"] = createExtensionConfigMock(configOverrides);
	configHelper["_editorConfig"] = createEditorConfigMock(editorOverrides);

	// Reload indent config with new editor settings
	configHelper["loadIndentConfig"]();

	// Register with singleton for code that uses getInstance()
	ConfigHelper._resetForTesting(configHelper);

	return configHelper;
}

/**
 * Creates a minimal ConfigHelper for simple tests
 * All options are disabled for predictable output
 */
export function createMinimalConfigHelper(): ConfigHelper {
	return createTestConfigHelper({
		configOverrides: {
			// Disable all optional features
			"template.showV-ModelTemplate": false,
			"option.showNameScriptOption": false,
			"option.showComponentsScriptOption": false,
			"option.showDirectivesScriptOption": false,
			"option.showPropsScriptOption": false,
			"option.showEmitsScriptOption": false,
			"option.showDataScriptOption": false,
			"option.showComputedScriptOption": false,
			"option.showWatchScriptOption": false,
			"option.showMethodsScriptOption": false,
			"lifecycle.showLifecycleHooksScriptOptions": false,
			"scriptSetup.useDefineModel": false,
			"scriptSetup.showDefineOptions": false,
			"scriptSetup.showDefineExpose": false,
			"scriptSetup.showDefineSlots": false,
		},
	});
}

/**
 * Creates a ConfigHelper with all features enabled for comprehensive testing
 */
export function createFullFeaturedConfigHelper(): ConfigHelper {
	return createTestConfigHelper({
		configOverrides: {
			// Enable all features
			"template.showV-ModelTemplate": true,
			"option.showNameScriptOption": true,
			"option.showComponentsScriptOption": true,
			"option.showDirectivesScriptOption": true,
			"option.showPropsScriptOption": true,
			"option.showEmitsScriptOption": true,
			"option.showDataScriptOption": true,
			"option.showComputedScriptOption": true,
			"option.showWatchScriptOption": true,
			"option.showMethodsScriptOption": true,
			"lifecycle.showLifecycleHooksScriptOptions": true,
			"lifecycle.showMountedScriptOption": true,
			"lifecycle.showUpdatedScriptOption": true,
			"lifecycle.showBeforeUnmountScriptOption": true,
			"scriptSetup.useDefineModel": true,
			"scriptSetup.showDefineOptions": true,
			"scriptSetup.showDefineExpose": true,
			"scriptSetup.showDefineSlots": true,
		},
	});
}

/**
 * Pre-built ConfigHelper configurations for common test scenarios
 */
export const ConfigHelperPresets = {
	/** Minimal configuration - all optional features disabled */
	minimal: () => createMinimalConfigHelper(),

	/** Full featured - all options enabled */
	fullFeatured: () => createFullFeaturedConfigHelper(),

	/** Script first layout */
	scriptFirst: () =>
		createTestConfigHelper({
			configOverrides: {
				"fileStructure.scriptTagComesFirst": true,
			},
		}),

	/** With tabs instead of spaces */
	withTabs: () =>
		createTestConfigHelper({
			editorOverrides: {
				insertSpaces: false,
				tabSize: 4,
			},
		}),

	/** Vue 3.4+ features enabled */
	vue34: () =>
		createTestConfigHelper({
			configOverrides: {
				"scriptSetup.useDefineModel": true,
				"scriptSetup.showDefineOptions": true,
			},
		}),
} as const;
