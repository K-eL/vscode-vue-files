/**
 * @fileoverview Service for creating Vue SFC files.
 * Contains all business logic for Vue file creation, separated from UI concerns.
 *
 * @module services/vue-file
 */
import { VueApiType } from "../enums/vue-api-type.enum";
import { VueScriptLang } from "../enums/vue-script-lang.enum";
import { VueStyleLang } from "../enums/vue-style-lang.enum";
import { generateVueSfcContent } from "../generators/vue-sfc.generator";
import { ConfigHelper } from "../helpers/config.helper";
import { BaseFileService, type TargetDirConfig } from "./base-file.service";
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
export class VueFileService extends BaseFileService {
	constructor(config?: ConfigHelper) {
		super(config);
	}

	/**
	 * Creates a new Vue SFC file
	 */
	async create(options: CreateVueFileOptions): Promise<CreateVueFileResult> {
		const {
			componentName,
			targetDirectory,
			apiType,
			scriptLang,
			styleLang,
			overwriteExisting = false,
		} = options;

		// Normalize name and determine file details
		const normalizedName = this.normalizeVueComponentName(componentName);
		const fileName = `${normalizedName}.vue`;

		// Build settings for content generation
		const settings = this.buildComponentSettings(normalizedName, apiType, scriptLang, styleLang);

		return this.createFile(
			fileName,
			targetDirectory,
			() => generateVueSfcContent(settings, this.config),
			overwriteExisting,
		);
	}

	/**
	 * Normalizes component name to PascalCase
	 */
	normalizeVueComponentName(name: string): string {
		return name
			.trim()
			.replace(/\.vue$/i, "")
			.split(/[-_\s]+/)
			.map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
			.join("");
	}

	/**
	 * Validates a component name (implements abstract method)
	 * @returns Error message if invalid, undefined if valid
	 */
	validateName(name: string): string | undefined {
		const emptyError = this.validateNotEmpty(name, "Component");
		if (emptyError) return emptyError;

		const cleanName = name.trim().replace(/\.vue$/i, "");
		return this.validatePattern(
			cleanName,
			/^[a-zA-Z][a-zA-Z0-9_-]*$/,
			"Component name must start with a letter and contain only alphanumeric characters, hyphens, or underscores",
		);
	}

	/**
	 * Gets the target directory options for Vue file creation
	 * Vue files don't have a specific subdirectory requirement
	 */
	getTargetDirectoryOptions(): TargetDirConfig {
		return {
			createSubdirectory: true, // TODO: Make configurable
			subdirectoryName: "components",
			subdirectoryAliases: ["component"],
		};
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
}

// Export singleton instance for convenience
export const vueFileService = new VueFileService();
