import * as vscode from "vscode";
import { VueApiType } from "../enums/vue-api-type.enum";
import { VueScriptLang } from "../enums/vue-script-lang.enum";
import { VueStyleLang } from "../enums/vue-style-lang.enum";

export interface TemplateChoice {
	label: string;
	description: string;
	apiType: VueApiType;
	scriptLang: VueScriptLang;
	styleLang: VueStyleLang;
}

interface RecentTemplate extends TemplateChoice {
	lastUsed: number;
}

const RECENT_TEMPLATES_KEY = "vscode-vue-files.recentTemplates";
const MAX_RECENT_TEMPLATES = 5;

export class QuickPickHelper {
	private context: vscode.ExtensionContext;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
	}

	/**
	 * Shows a quick pick with recently used templates and all available templates
	 * @returns The selected template choice or undefined if cancelled
	 */
	public async showTemplateQuickPick(): Promise<TemplateChoice | undefined> {
		const recentTemplates = this.getRecentTemplates();
		const allTemplates = this.getAllTemplates();

		const items: vscode.QuickPickItem[] = [];

		// Add recent templates section
		if (recentTemplates.length > 0) {
			items.push({
				label: "Recently Used",
				kind: vscode.QuickPickItemKind.Separator,
			});

		recentTemplates.forEach((template) => {
			const item: vscode.QuickPickItem & Partial<TemplateChoice> = {
				label: `$(clock) ${template.label}`,
				description: template.description,
				detail: this.getTemplateDetail(template),
				apiType: template.apiType,
				scriptLang: template.scriptLang,
				styleLang: template.styleLang,
			};
			items.push(item);
		});
		}

		// Add all templates section
		items.push({
			label: "All Templates",
			kind: vscode.QuickPickItemKind.Separator,
		});

		allTemplates.forEach((template) => {
			// Skip if already in recent templates
			const isRecent = recentTemplates.some(
				(recent) =>
					recent.apiType === template.apiType &&
					recent.scriptLang === template.scriptLang &&
					recent.styleLang === template.styleLang,
			);

			if (!isRecent) {
				const item: vscode.QuickPickItem & Partial<TemplateChoice> = {
					label: template.label,
					description: template.description,
					detail: this.getTemplateDetail(template),
					apiType: template.apiType,
					scriptLang: template.scriptLang,
					styleLang: template.styleLang,
				};
				items.push(item);
			}
		});

		const selected = await vscode.window.showQuickPick(items, {
			placeHolder: "Select a Vue file template",
			matchOnDescription: true,
			matchOnDetail: true,
		});

		if (!selected || selected.kind === vscode.QuickPickItemKind.Separator) {
			return undefined;
		}

		const templateChoice = selected as vscode.QuickPickItem & TemplateChoice;

		// Save to recent templates
		this.saveRecentTemplate({
			label: templateChoice.label.replace("$(clock) ", ""),
			description: templateChoice.description || "",
			apiType: templateChoice.apiType,
			scriptLang: templateChoice.scriptLang,
			styleLang: templateChoice.styleLang,
			lastUsed: Date.now(),
		});

		return {
			label: templateChoice.label.replace("$(clock) ", ""),
			description: templateChoice.description || "",
			apiType: templateChoice.apiType,
			scriptLang: templateChoice.scriptLang,
			styleLang: templateChoice.styleLang,
		};
	}

	/**
	 * Gets all available template combinations
	 */
	private getAllTemplates(): TemplateChoice[] {
		const config = vscode.workspace.getConfiguration("vscode-vue-files");

		const templates: TemplateChoice[] = [];

		// Composition API templates
		if (config.get<boolean>("menu.showCompositionApi", true)) {
			if (config.get<boolean>("menu.showTypescript", true)) {
				if (config.get<boolean>("menu.showScss", true)) {
				templates.push({
					label: "Composition API (Setup) + TypeScript + SCSS",
					description: "Modern Vue 3 with TypeScript and SCSS",
					apiType: VueApiType.setup,
					scriptLang: VueScriptLang.typeScript,
					styleLang: VueStyleLang.scss,
				});
				}
				if (config.get<boolean>("menu.showCss", true)) {
					templates.push({
						label: "Composition API (Setup) + TypeScript + CSS",
						description: "Modern Vue 3 with TypeScript and CSS",
						apiType: VueApiType.setup,
						scriptLang: VueScriptLang.typeScript,
						styleLang: VueStyleLang.css,
					});
				}
			}
			if (config.get<boolean>("menu.showJavascript", true)) {
				if (config.get<boolean>("menu.showScss", true)) {
					templates.push({
						label: "Composition API (Setup) + JavaScript + SCSS",
						description: "Modern Vue 3 with JavaScript and SCSS",
						apiType: VueApiType.setup,
						scriptLang: VueScriptLang.javaScript,
						styleLang: VueStyleLang.scss,
					});
				}
				if (config.get<boolean>("menu.showCss", true)) {
					templates.push({
						label: "Composition API (Setup) + JavaScript + CSS",
						description: "Modern Vue 3 with JavaScript and CSS",
						apiType: VueApiType.setup,
						scriptLang: VueScriptLang.javaScript,
						styleLang: VueStyleLang.css,
					});
				}
			}
		}

		// Options API templates
		if (config.get<boolean>("menu.showOptionsApi", true)) {
			if (config.get<boolean>("menu.showTypescript", true)) {
				if (config.get<boolean>("menu.showScss", true)) {
					templates.push({
						label: "Options API + TypeScript + SCSS",
						description: "Classic Vue with TypeScript and SCSS",
						apiType: VueApiType.options,
						scriptLang: VueScriptLang.typeScript,
						styleLang: VueStyleLang.scss,
					});
				}
				if (config.get<boolean>("menu.showCss", true)) {
					templates.push({
						label: "Options API + TypeScript + CSS",
						description: "Classic Vue with TypeScript and CSS",
						apiType: VueApiType.options,
						scriptLang: VueScriptLang.typeScript,
						styleLang: VueStyleLang.css,
					});
				}
			}
			if (config.get<boolean>("menu.showJavascript", true)) {
				if (config.get<boolean>("menu.showScss", true)) {
					templates.push({
						label: "Options API + JavaScript + SCSS",
						description: "Classic Vue with JavaScript and SCSS",
						apiType: VueApiType.options,
						scriptLang: VueScriptLang.javaScript,
						styleLang: VueStyleLang.scss,
					});
				}
				if (config.get<boolean>("menu.showCss", true)) {
					templates.push({
						label: "Options API + JavaScript + CSS",
						description: "Classic Vue with JavaScript and CSS",
						apiType: VueApiType.options,
						scriptLang: VueScriptLang.javaScript,
						styleLang: VueStyleLang.css,
					});
				}
			}
		}

		return templates;
	}

	/**
	 * Gets recent templates from workspace state
	 */
	private getRecentTemplates(): RecentTemplate[] {
		const recent =
			this.context.workspaceState.get<RecentTemplate[]>(
				RECENT_TEMPLATES_KEY,
			) || [];
		return recent.sort((a, b) => b.lastUsed - a.lastUsed);
	}

	/**
	 * Saves a template to recent templates
	 */
	private saveRecentTemplate(template: RecentTemplate): void {
		let recent = this.getRecentTemplates();

		// Remove if already exists
		recent = recent.filter(
			(t) =>
				!(
					t.apiType === template.apiType &&
					t.scriptLang === template.scriptLang &&
					t.styleLang === template.styleLang
				),
		);

		// Add to beginning
		recent.unshift(template);

		// Keep only MAX_RECENT_TEMPLATES
		recent = recent.slice(0, MAX_RECENT_TEMPLATES);

		this.context.workspaceState.update(RECENT_TEMPLATES_KEY, recent);
	}

	/**
	 * Generates detail text for a template
	 */
	private getTemplateDetail(template: TemplateChoice): string {
		const parts: string[] = [];

		if (template.apiType === VueApiType.setup) {
			parts.push("Script Setup");
		} else {
			parts.push("Options API");
		}

		parts.push(template.scriptLang.toUpperCase());
		parts.push(template.styleLang.toUpperCase());

		return parts.join(" • ");
	}

	/**
	 * Clears recent templates (useful for testing or user preference)
	 */
	public clearRecentTemplates(): void {
		this.context.workspaceState.update(RECENT_TEMPLATES_KEY, []);
	}
}
