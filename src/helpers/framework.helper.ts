import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { FrameworkType } from "../enums/framework-type.enum";

export class FrameworkHelper {
	private detectedFramework: FrameworkType | null = null;
	private workspaceRoot: string | undefined;

	constructor() {
		this.workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
	}

	/**
	 * Detects the Vue framework used in the current workspace
	 * @returns The detected framework type
	 */
	public detectFramework(): FrameworkType {
		// Check if auto-detection is enabled
		const config = vscode.workspace.getConfiguration("vscode-vue-files");
		const autoDetect = config.get<boolean>("framework.autoDetect", true);

		// Check for manual override
		const override = config.get<string>("framework.override", "none");
		if (override !== "none") {
			this.detectedFramework = override as FrameworkType;
			return this.detectedFramework;
		}

		// If auto-detect is disabled, return none
		if (!autoDetect) {
			this.detectedFramework = FrameworkType.None;
			return this.detectedFramework;
		}

		// Auto-detect framework from package.json
		this.detectedFramework = this.autoDetectFramework();
		return this.detectedFramework;
	}

	/**
	 * Gets the currently detected or cached framework
	 */
	public getFramework(): FrameworkType {
		if (this.detectedFramework === null) {
			return this.detectFramework();
		}
		return this.detectedFramework;
	}

	/**
	 * Checks if the current project is a Nuxt project
	 */
	public isNuxt(): boolean {
		return this.getFramework() === FrameworkType.Nuxt;
	}

	/**
	 * Checks if the current project is a Vite project
	 */
	public isVite(): boolean {
		return this.getFramework() === FrameworkType.Vite;
	}

	/**
	 * Checks if the current project is a Vue CLI project
	 */
	public isVueCli(): boolean {
		return this.getFramework() === FrameworkType.VueCli;
	}

	/**
	 * Auto-detects the framework by reading package.json
	 */
	private autoDetectFramework(): FrameworkType {
		if (!this.workspaceRoot) {
			return FrameworkType.None;
		}

		const packageJsonPath = path.join(this.workspaceRoot, "package.json");

		// Check if package.json exists
		if (!fs.existsSync(packageJsonPath)) {
			return FrameworkType.None;
		}

		try {
			const packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
			const packageJson = JSON.parse(packageJsonContent);

			const dependencies = {
				...packageJson.dependencies,
				...packageJson.devDependencies,
			};

			// Check for Nuxt (highest priority as it may also have Vite)
			if (dependencies["nuxt"] || dependencies["nuxt3"]) {
				return FrameworkType.Nuxt;
			}

			// Check for Vite
			if (dependencies["vite"] || dependencies["@vitejs/plugin-vue"]) {
				return FrameworkType.Vite;
			}

			// Check for Vue CLI
			if (dependencies["@vue/cli-service"]) {
				return FrameworkType.VueCli;
			}

			return FrameworkType.None;
		} catch (error) {
			console.error("Error reading package.json:", error);
			return FrameworkType.None;
		}
	}

	/**
	 * Refreshes the framework detection (useful after package.json changes)
	 */
	public refresh(): FrameworkType {
		this.detectedFramework = null;
		return this.detectFramework();
	}

	/**
	 * Gets framework-specific recommendations or defaults
	 */
	public getFrameworkDefaults(): {
		preferTypeScript: boolean;
		preferScriptSetup: boolean;
		preferScoped: boolean;
	} {
		const framework = this.getFramework();

		switch (framework) {
			case FrameworkType.Nuxt:
				return {
					preferTypeScript: true,
					preferScriptSetup: true,
					preferScoped: true,
				};
			case FrameworkType.Vite:
				return {
					preferTypeScript: true,
					preferScriptSetup: true,
					preferScoped: false,
				};
			case FrameworkType.VueCli:
				return {
					preferTypeScript: false,
					preferScriptSetup: false,
					preferScoped: true,
				};
			default:
				return {
					preferTypeScript: false,
					preferScriptSetup: false,
					preferScoped: false,
				};
		}
	}
}
