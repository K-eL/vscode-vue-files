import * as vscode from "vscode";

/**
 * Centralized configuration helper for the Vue Files extension.
 *
 * This class provides type-safe access to all extension settings,
 * organized by feature area. All configuration access should go through
 * this helper to ensure consistency and maintainability.
 *
 * @example
 * ```typescript
 * const config = new ConfigHelper();
 *
 * // Editor settings
 * const indent = config.ind(2);
 *
 * // Feature settings
 * if (config.pinia.createInStoresFolder()) { ... }
 * if (config.composables.useTypeScript()) { ... }
 * ```
 */
export class ConfigHelper {
	private _editorConfig: vscode.WorkspaceConfiguration | undefined;
	private _vueFilesConfig: vscode.WorkspaceConfiguration | undefined;
	private _useTabs = false;
	private _tabSize = 2;

	constructor() {
		this.loadConfigurations();
	}

	// ==========================================================================
	// PRIVATE: Configuration Loading
	// ==========================================================================

	private loadConfigurations(): void {
		this.loadVueFilesConfig();
		this.loadEditorConfig();
		this.loadIndentConfig();
	}

	private loadVueFilesConfig(): void {
		try {
			this._vueFilesConfig ??=
				vscode.workspace.getConfiguration("vscode-vue-files");
		} catch (error) {
			console.error(
				"[ConfigHelper] Failed to load vscode-vue-files config:",
				error,
			);
		}
	}

	private loadEditorConfig(): void {
		try {
			this._editorConfig ??= vscode.workspace.getConfiguration("editor");
		} catch (error) {
			console.error("[ConfigHelper] Failed to load editor config:", error);
		}
	}

	private loadIndentConfig(): void {
		this._useTabs = !this._editorConfig?.get("insertSpaces", true);
		this._tabSize = this._editorConfig?.get("tabSize", 2) ?? 2;
	}

	/**
	 * Generic getter with type safety and default value
	 */
	private get<T>(key: string, defaultValue: T): T {
		return this._vueFilesConfig?.get<T>(key, defaultValue) ?? defaultValue;
	}

	// ==========================================================================
	// PUBLIC: Editor / Indentation
	// ==========================================================================

	/**
	 * Returns indentation string based on editor settings
	 * @param level - Number of indentation levels (default: 1)
	 * @returns Tabs or spaces string
	 */
	public ind = (level: number = 1): string => {
		return this._useTabs
			? "\t".repeat(level)
			: " ".repeat(this._tabSize * level);
	};

	// ==========================================================================
	// PUBLIC: File Structure
	// ==========================================================================

	/**
	 * Whether the script tag should come before the template tag
	 * @default false
	 */
	public isScriptFirst(): boolean {
		return this.get("fileStructure.scriptTagComesFirst", false);
	}

	// ==========================================================================
	// PUBLIC: Template Options
	// ==========================================================================

	/**
	 * Whether to generate a working v-model structure in new files
	 * @default true
	 */
	public showVModelTemplate(): boolean {
		return this.get("template.showV-ModelTemplate", true);
	}

	// ==========================================================================
	// PUBLIC: Menu Visibility
	// ==========================================================================

	/** @namespace menu - Menu visibility settings */
	public readonly menu = {
		showCompositionApi: (): boolean =>
			this.get("menu.showCompositionApi", true),
		showOptionsApi: (): boolean => this.get("menu.showOptionsApi", true),
		showTypescript: (): boolean => this.get("menu.showTypescript", true),
		showJavascript: (): boolean => this.get("menu.showJavascript", true),
		showCss: (): boolean => this.get("menu.showCss", true),
		showScss: (): boolean => this.get("menu.showScss", true),
	};

	// ==========================================================================
	// PUBLIC: Framework Detection
	// ==========================================================================

	/** @namespace framework - Framework detection settings */
	public readonly framework = {
		/**
		 * Whether to auto-detect Vue framework from package.json
		 * @default true
		 */
		autoDetect: (): boolean => this.get("framework.autoDetect", true),

		/**
		 * Manual framework override (none | nuxt | vite | vue-cli)
		 * @default "none"
		 */
		override: (): string => this.get("framework.override", "none"),
	};

	// ==========================================================================
	// PUBLIC: Options API Script Options
	// ==========================================================================

	/** @namespace options - Options API script section settings */
	public readonly options = {
		showName: (): boolean => this.get("option.showNameScriptOption", true),
		showComponents: (): boolean =>
			this.get("option.showComponentsScriptOption", true),
		showDirectives: (): boolean =>
			this.get("option.showDirectivesScriptOption", false),
		showExtends: (): boolean =>
			this.get("option.showExtendsScriptOption", false),
		showMixins: (): boolean => this.get("option.showMixinsScriptOption", false),
		showProvideInject: (): boolean =>
			this.get("option.showProvideInjectScriptOption", false),
		showInheritAttrs: (): boolean =>
			this.get("option.showInheritAttributesScriptOption", false),
		showProps: (): boolean => this.get("option.showPropsScriptOption", true),
		showEmits: (): boolean => this.get("option.showEmitsScriptOption", true),
		showSetup: (): boolean => this.get("option.showSetupScriptOption", false),
		showData: (): boolean => this.get("option.showDataScriptOption", true),
		showComputed: (): boolean =>
			this.get("option.showComputedScriptOption", true),
		showWatch: (): boolean => this.get("option.showWatchScriptOption", true),
		showMethods: (): boolean =>
			this.get("option.showMethodsScriptOption", true),
	};

	// ==========================================================================
	// PUBLIC: Lifecycle Hooks
	// ==========================================================================

	/** @namespace lifecycle - Lifecycle hooks visibility settings */
	public readonly lifecycle = {
		/** Master toggle for all lifecycle hooks */
		showHooks: (): boolean =>
			this.get("lifecycle.showLifecycleHooksScriptOptions", true),
		showBeforeCreate: (): boolean =>
			this.get("lifecycle.showBeforeCreateScriptOption", false),
		showCreated: (): boolean =>
			this.get("lifecycle.showCreatedScriptOption", false),
		showBeforeMount: (): boolean =>
			this.get("lifecycle.showBeforeMountScriptOption", false),
		showMounted: (): boolean =>
			this.get("lifecycle.showMountedScriptOption", true),
		showBeforeUpdate: (): boolean =>
			this.get("lifecycle.showBeforeUpdateScriptOption", false),
		showUpdated: (): boolean =>
			this.get("lifecycle.showUpdatedScriptOption", true),
		showActivated: (): boolean =>
			this.get("lifecycle.showActivatedScriptOption", false),
		showDeactivated: (): boolean =>
			this.get("lifecycle.showDeactivatedScriptOption", false),
		showBeforeUnmount: (): boolean =>
			this.get("lifecycle.showBeforeUnmountScriptOption", true),
		showUnmounted: (): boolean =>
			this.get("lifecycle.showUnmountedScriptOption", false),
		showErrorCaptured: (): boolean =>
			this.get("lifecycle.showErrorCapturedScriptOption", false),
		showRenderTracked: (): boolean =>
			this.get("lifecycle.showRenderTrackedScriptOption", false),
		showRenderTriggered: (): boolean =>
			this.get("lifecycle.showRenderTriggeredScriptOption", false),
	};

	// ==========================================================================
	// PUBLIC: Script Setup Macros (Vue 3.3+/3.4+)
	// ==========================================================================

	/** @namespace scriptSetup - Script setup macro settings */
	public readonly scriptSetup = {
		/**
		 * Use defineModel() (Vue 3.4+) instead of defineProps + defineEmits for v-model
		 * Disable for Vue < 3.4 compatibility
		 * @default true
		 */
		useDefineModel: (): boolean => this.get("scriptSetup.useDefineModel", true),

		/**
		 * Use withDefaults() with defineProps for TypeScript projects
		 * @default true
		 */
		useWithDefaults: (): boolean =>
			this.get("scriptSetup.useWithDefaults", true),

		/**
		 * Include defineOptions() macro (Vue 3.3+) for inheritAttrs, name, etc.
		 * @default false
		 */
		showDefineOptions: (): boolean =>
			this.get("scriptSetup.showDefineOptions", false),

		/**
		 * Include defineExpose() macro to expose component internals via template ref
		 * @default false
		 */
		showDefineExpose: (): boolean =>
			this.get("scriptSetup.showDefineExpose", false),

		/**
		 * Include defineSlots() macro (Vue 3.3+) for typed slot definitions
		 * @default false
		 */
		showDefineSlots: (): boolean =>
			this.get("scriptSetup.showDefineSlots", false),
	};

	// ==========================================================================
	// PUBLIC: Pinia Stores
	// ==========================================================================

	/** @namespace pinia - Pinia store generation settings */
	public readonly pinia = {
		/**
		 * Default store type: "setup" (Composition API) or "options" (Options API)
		 * @default "setup"
		 */
		defaultStoreType: (): string => this.get("pinia.defaultStoreType", "setup"),

		/**
		 * Automatically create stores in a 'stores' subfolder
		 * @default true
		 */
		createInStoresFolder: (): boolean =>
			this.get("pinia.createInStoresFolder", true),

		/**
		 * Include example state, getters, and actions in generated stores
		 * @default true
		 */
		includeExamples: (): boolean => this.get("pinia.includeExamples", true),
	};

	// ==========================================================================
	// PUBLIC: Composables
	// ==========================================================================

	/** @namespace composables - Composable generation settings */
	public readonly composables = {
		/**
		 * Automatically create composables in a 'composables' subfolder
		 * @default true
		 */
		createInComposablesFolder: (): boolean =>
			this.get("composables.createInComposablesFolder", true),

		/**
		 * Generate composables with TypeScript types and generics
		 * @default true
		 */
		useTypeScript: (): boolean => this.get("composables.useTypeScript", true),
	};

}
