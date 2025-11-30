/**
 * @fileoverview Mock for vscode.WorkspaceConfiguration
 * Provides a flexible mock that can be customized per test
 */
import * as vscode from "vscode";

/**
 * Default configuration values used across tests
 * These mirror the extension's default settings
 */
export const DEFAULT_CONFIG_VALUES: Record<string, unknown> = {
	// File Structure
	"fileStructure.scriptTagComesFirst": false,

	// Template
	"template.showV-ModelTemplate": false,

	// Menu
	"menu.showCompositionApi": true,
	"menu.showOptionsApi": true,
	"menu.showTypescript": true,
	"menu.showJavascript": true,
	"menu.showCss": true,
	"menu.showScss": true,

	// Framework
	"framework.autoDetect": true,
	"framework.override": "none",

	// Options API
	"option.showNameScriptOption": true,
	"option.showComponentsScriptOption": false,
	"option.showDirectivesScriptOption": false,
	"option.showExtendsScriptOption": false,
	"option.showMixinsScriptOption": false,
	"option.showProvideInjectScriptOption": false,
	"option.showInheritAttributesScriptOption": false,
	"option.showPropsScriptOption": false,
	"option.showEmitsScriptOption": false,
	"option.showSetupScriptOption": false,
	"option.showDataScriptOption": false,
	"option.showComputedScriptOption": false,
	"option.showWatchScriptOption": false,
	"option.showMethodsScriptOption": false,

	// Lifecycle
	"lifecycle.showLifecycleHooksScriptOptions": false,
	"lifecycle.showBeforeCreateScriptOption": false,
	"lifecycle.showCreatedScriptOption": false,
	"lifecycle.showBeforeMountScriptOption": false,
	"lifecycle.showMountedScriptOption": false,
	"lifecycle.showBeforeUpdateScriptOption": false,
	"lifecycle.showUpdatedScriptOption": false,
	"lifecycle.showActivatedScriptOption": false,
	"lifecycle.showDeactivatedScriptOption": false,
	"lifecycle.showBeforeUnmountScriptOption": false,
	"lifecycle.showUnmountedScriptOption": false,
	"lifecycle.showErrorCapturedScriptOption": false,
	"lifecycle.showRenderTrackedScriptOption": false,
	"lifecycle.showRenderTriggeredScriptOption": false,

	// Script Setup Macros
	"scriptSetup.useDefineModel": false,
	"scriptSetup.useWithDefaults": false,
	"scriptSetup.showDefineOptions": false,
	"scriptSetup.showDefineExpose": false,
	"scriptSetup.showDefineSlots": false,

	// Pinia
	"pinia.defaultStoreType": "setup",
	"pinia.createInStoresFolder": true,
	"pinia.includeExamples": true,

	// Composables
	"composables.createInComposablesFolder": true,
	"composables.useTypeScript": true,
};

/**
 * Default editor configuration values
 */
export const DEFAULT_EDITOR_CONFIG: Record<string, unknown> = {
	insertSpaces: true,
	tabSize: 2,
};

/**
 * Creates a mock WorkspaceConfiguration for vscode-vue-files settings
 *
 * @param overrides - Key-value pairs to override default values
 * @returns Mock WorkspaceConfiguration object
 *
 * @example
 * ```typescript
 * const mockConfig = createExtensionConfigMock({
 *   "fileStructure.scriptTagComesFirst": true,
 *   "scriptSetup.useDefineModel": true,
 * });
 * ```
 */
export function createExtensionConfigMock(
	overrides: Record<string, unknown> = {},
): vscode.WorkspaceConfiguration {
	const values = { ...DEFAULT_CONFIG_VALUES, ...overrides };

	return {
		get: <T>(key: string, defaultValue?: T): T | undefined => {
			const value = values[key];
			return (value !== undefined ? value : defaultValue) as T | undefined;
		},
		has: (key: string): boolean => key in values,
		update: (): Promise<void> => Promise.resolve(),
		inspect: () => undefined,
	};
}

/**
 * Creates a mock WorkspaceConfiguration for editor settings
 *
 * @param overrides - Key-value pairs to override default values
 * @returns Mock WorkspaceConfiguration object
 *
 * @example
 * ```typescript
 * const editorConfig = createEditorConfigMock({
 *   insertSpaces: false, // Use tabs
 *   tabSize: 4,
 * });
 * ```
 */
export function createEditorConfigMock(
	overrides: Record<string, unknown> = {},
): vscode.WorkspaceConfiguration {
	const values = { ...DEFAULT_EDITOR_CONFIG, ...overrides };

	return {
		get: <T>(key: string, defaultValue?: T): T | undefined => {
			const value = values[key];
			return (value !== undefined ? value : defaultValue) as T | undefined;
		},
		has: (key: string): boolean => key in values,
		update: (): Promise<void> => Promise.resolve(),
		inspect: () => undefined,
	};
}
