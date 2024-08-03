import * as vscode from "vscode";

export class ConfigHelper {
	private _editorConfig: vscode.WorkspaceConfiguration | undefined;
	private _vueFilesConfig: vscode.WorkspaceConfiguration | undefined;
	private _useTabs = false;
	private _tabSize = 2;

	constructor() {
		this.loadVueFilesConfig();
		this.loadEditorConfig();
		this.loadIndentConfig();
	}

	private loadVueFilesConfig(): void {
		try {
			this._vueFilesConfig ??=
				vscode.workspace.getConfiguration("vscode-vue-files");
		} catch (error) {
			console.error(error);
		}
	}

	private loadEditorConfig(): void {
		try {
			this._editorConfig ??= vscode.workspace.getConfiguration("editor");
		} catch (error) {
			console.error(error);
		}
	}

	private loadIndentConfig(): void {
		this._useTabs ??= !this._editorConfig?.get("insertSpaces");
		this._tabSize ??= this._editorConfig?.get("tabSize") || 2;
	}

	public ind = (x: number = 1): string => {
		return this._useTabs ? "\t".repeat(x) : " ".repeat(this._tabSize * x);
	};

	public isScriptFirst(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"fileStructure.scriptTagComesFirst",
			) as boolean) ?? false
		);
	}

	public showVModelTemplate(): boolean {
		return (
			(this._vueFilesConfig?.get("template.showV-ModelTemplate") as boolean) ??
			true
		);
	}

	public showNameScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get("option.showNameScriptOption") as boolean) ??
			true
		);
	}

	public showComponentsScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"option.showComponentsScriptOption",
			) as boolean) ?? true
		);
	}

	public showDirectivesScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"option.showDirectivesScriptOption",
			) as boolean) ?? true
		);
	}

	public showExtendsScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"option.showExtendsScriptOption",
			) as boolean) ?? true
		);
	}

	public showMixinsScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get("option.showMixinsScriptOption") as boolean) ??
			true
		);
	}

	public showProvideInjectScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"option.showProvideInjectScriptOption",
			) as boolean) ?? true
		);
	}

	public showInheritAttrsScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"option.showInheritAttributesScriptOption",
			) as boolean) ?? true
		);
	}

	public showPropsScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get("option.showPropsScriptOption") as boolean) ??
			true
		);
	}

	public showEmitsScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get("option.showEmitsScriptOption") as boolean) ??
			true
		);
	}

	public showSetupScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get("option.showSetupScriptOption") as boolean) ??
			true
		);
	}

	public showDataScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get("option.showDataScriptOption") as boolean) ??
			true
		);
	}

	public showComputedScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"option.showComputedScriptOption",
			) as boolean) ?? true
		);
	}

	public showWatchScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get("option.showWatchScriptOption") as boolean) ??
			true
		);
	}

	public showLifecycleHooksScriptOptions(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"lifecycle.showLifecycleHooksScriptOptions",
			) as boolean) ?? true
		);
	}

	public showBeforeCreateScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"lifecycle.showBeforeCreateScriptOption",
			) as boolean) ?? true
		);
	}

	public showCreatedScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"lifecycle.showCreatedScriptOption",
			) as boolean) ?? true
		);
	}

	public showBeforeMountScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"lifecycle.showBeforeMountScriptOption",
			) as boolean) ?? true
		);
	}

	public showMountedScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"lifecycle.showMountedScriptOption",
			) as boolean) ?? true
		);
	}

	public showBeforeUpdateScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"lifecycle.showBeforeUpdateScriptOption",
			) as boolean) ?? true
		);
	}

	public showUpdatedScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"lifecycle.showUpdatedScriptOption",
			) as boolean) ?? true
		);
	}

	public showActivatedScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"lifecycle.showActivatedScriptOption",
			) as boolean) ?? true
		);
	}

	public showDeactivatedScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"lifecycle.showDeactivatedScriptOption",
			) as boolean) ?? true
		);
	}

	public showBeforeUnmountScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"lifecycle.showBeforeUnmountScriptOption",
			) as boolean) ?? true
		);
	}

	public showUnmountedScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"lifecycle.showUnmountedScriptOption",
			) as boolean) ?? true
		);
	}

	public showErrorCapturedScriptOption(): boolean {
		return (
			(this._vueFilesConfig?.get(
				"lifecycle.showErrorCapturedScriptOption",
			) as boolean) ?? true
		);
	}

	public showRenderTrackedScriptOption = (): boolean => {
		return (
			(this._vueFilesConfig?.get(
				"lifecycle.showRenderTrackedScriptOption",
			) as boolean) ?? true
		);
	};

	public showRenderTriggeredScriptOption = (): boolean => {
		return (
			(this._vueFilesConfig?.get(
				"lifecycle.showRenderTriggeredScriptOption",
			) as boolean) ?? true
		);
	};

	public showMethodsScriptOption = (): boolean => {
		return (
			(this._vueFilesConfig?.get(
				"option.showMethodsScriptOption",
			) as boolean) ?? true
		);
	};
}
