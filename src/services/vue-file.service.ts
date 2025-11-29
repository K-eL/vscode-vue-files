/**
 * @fileoverview Service for creating Vue SFC files.
 * Contains all business logic for Vue file creation, separated from UI concerns.
 *
 * @module services/vue-file
 */
import * as path from "path";
import * as fs from "fs";
import { VueApiType } from "../enums/vue-api-type.enum";
import { VueScriptLang } from "../enums/vue-script-lang.enum";
import { VueStyleLang } from "../enums/vue-style-lang.enum";
import { generateVueSfcContent } from "../generators/vue-sfc.generator";
import { ConfigHelper } from "../helpers/config.helper";
import { ensureDirectoryExists, fileExists } from "../helpers/target-directory.helper";
import { VueComponentSettings } from "../interfaces/vue-component-settings";
import type { CreateVueFileResult } from "../interfaces/service-result";

/**
 * Options for creating a Vue SFC file
 */
export interface CreateVueFileOptions {
	/** Raw component name entered by user */
	componentName: string;
	/** Target directory for file creation */
	targetDirectory: string;
	/** Vue API type (composition or options) */
	apiType: VueApiType;
	/** Script language (ts or js) */
	scriptLang: VueScriptLang;
	/** Style language (css, scss, etc.) */
	styleLang: VueStyleLang;
	/** Whether to overwrite if file exists */
	overwriteExisting?: boolean;
}

/**
 * Quick pick option for Vue file creation
 */
export interface VueFileQuickPickOption {
	label: string;
	detail: string;
	apiType: VueApiType;
	scriptLang: VueScriptLang;
	styleLang: VueStyleLang;
}

/**
 * Service class for Vue SFC file operations
 */
export class VueFileService {
	private config: ConfigHelper;

	constructor(config?: ConfigHelper) {
		this.config = config ?? ConfigHelper.getInstance();
	}

	/**
	 * Creates a new Vue SFC file
	 */
	async create(options: CreateVueFileOptions): Promise<CreateVueFileResult> {
		try {
			const {
				componentName,
				targetDirectory,
				apiType,
				scriptLang,
				styleLang,
				overwriteExisting = false,
			} = options;

			// Normalize name and determine file details
			const normalizedName = this.normalizeComponentName(componentName);
			const fileName = `${normalizedName}.vue`;
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

			// Build settings
			const settings = this.buildComponentSettings(normalizedName, apiType, scriptLang, styleLang);

			// Generate content
			const content = generateVueSfcContent(settings, this.config);

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
	 * Normalizes component name to PascalCase
	 */
	normalizeComponentName(name: string): string {
		return name
			.trim()
			.replace(/\.vue$/i, "")
			.split(/[-_\s]+/)
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
			.join("");
	}

	/**
	 * Validates a component name
	 * @returns Error message if invalid, undefined if valid
	 */
	validateComponentName(name: string): string | undefined {
		if (!name || name.trim().length === 0) {
			return "Component name is required";
		}
		const cleanName = name.trim().replace(/\.vue$/i, "");
		if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(cleanName)) {
			return "Component name must start with a letter and contain only alphanumeric characters, hyphens, or underscores";
		}
		return undefined;
	}

	/**
	 * Builds Vue component settings from options
	 */
	buildComponentSettings(
		componentName: string,
		apiType: VueApiType,
		scriptLang: VueScriptLang,
		styleLang: VueStyleLang,
	): VueComponentSettings {
		return {
			componentName,
			apiType,
			scriptLang,
			styleLang,
		};
	}

	/**
	 * Generates quick pick options based on menu visibility settings
	 */
	getQuickPickOptions(): VueFileQuickPickOption[] {
		const options: VueFileQuickPickOption[] = [];
		const menu = this.config.menu;

		// Composition API + TypeScript
		if (menu.showCompositionApi() && menu.showTypescript()) {
			options.push({
				label: "$(code) Composition API + TypeScript",
				detail: "Modern Vue 3 with type safety",
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.scss,
			});
		}

		// Composition API + JavaScript
		if (menu.showCompositionApi() && menu.showJavascript()) {
			options.push({
				label: "$(code) Composition API + JavaScript",
				detail: "Modern Vue 3 without TypeScript",
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.javaScript,
				styleLang: VueStyleLang.scss,
			});
		}

		// Options API + TypeScript
		if (menu.showOptionsApi() && menu.showTypescript()) {
			options.push({
				label: "$(symbol-class) Options API + TypeScript",
				detail: "Classic Vue with type safety",
				apiType: VueApiType.options,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.scss,
			});
		}

		// Options API + JavaScript
		if (menu.showOptionsApi() && menu.showJavascript()) {
			options.push({
				label: "$(symbol-class) Options API + JavaScript",
				detail: "Classic Vue without TypeScript",
				apiType: VueApiType.options,
				scriptLang: VueScriptLang.javaScript,
				styleLang: VueStyleLang.scss,
			});
		}

		return options;
	}

	/**
	 * Gets the default style language from config
	 */
	getDefaultStyleLang(): VueStyleLang {
		if (this.config.menu.showScss()) {
			return VueStyleLang.scss;
		}
		return VueStyleLang.css;
	}

	/**
	 * Checks if a combination is visible in menu
	 */
	isMenuOptionVisible(apiType: VueApiType, scriptLang: VueScriptLang): boolean {
		const menu = this.config.menu;
		const apiVisible =
			(apiType === VueApiType.setup && menu.showCompositionApi()) ||
			(apiType === VueApiType.options && menu.showOptionsApi());
		const langVisible =
			(scriptLang === VueScriptLang.typeScript && menu.showTypescript()) ||
			(scriptLang === VueScriptLang.javaScript && menu.showJavascript());
		return apiVisible && langVisible;
	}
}

// Export singleton instance for convenience
export const vueFileService = new VueFileService();
