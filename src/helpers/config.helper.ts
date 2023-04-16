import * as vscode from 'vscode';

let config: vscode.WorkspaceConfiguration | undefined;

export const loadWorkspaceConfig = (): vscode.WorkspaceConfiguration => {
	config = vscode.workspace.getConfiguration('vscode-vue-files');
	return config;
};

export const isScriptFirst = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('fileStructure.scriptTagComesFirst') as boolean ?? false;
};

export const showVModelTemplate = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('template.showV-ModelTemplate') as boolean ?? true;
};

export const showNameScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('option.showNameScriptOption') as boolean ?? true;
};

export const showComponentsScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('option.showComponentsScriptOption') as boolean ?? true;
};

export const showDirectivesScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('option.showDirectivesScriptOption') as boolean ?? true;
};

export const showExtendsScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('option.showExtendsScriptOption') as boolean ?? true;
};

export const showMixinsScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('option.showMixinsScriptOption') as boolean ?? true;
};

export const showProvideInjectScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('option.showProvideInjectScriptOption') as boolean ?? true;
};

export const showInheritAttrsScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('option.showInheritAttributesScriptOption') as boolean ?? true;
};

export const showPropsScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('option.showPropsScriptOption') as boolean ?? true;
};

export const showEmitsScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('option.showEmitsScriptOption') as boolean ?? true;
};

export const showSetupScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('option.showSetupScriptOption') as boolean ?? true;
};

export const showDataScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('option.showDataScriptOption') as boolean ?? true;
};

export const showComputedScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('option.showComputedScriptOption') as boolean ?? true;
};
export const showWatchScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('option.showWatchScriptOption') as boolean ?? true;
};

export const showLifecycleHooksScriptOptions = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('lifecycle.showLifecycleHooksScriptOptions') as boolean ?? true;
};

export const showBeforeCreateScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('lifecycle.showBeforeCreateScriptOption') as boolean ?? true;
};

export const showCreatedScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('lifecycle.showCreatedScriptOption') as boolean ?? true;
};

export const showBeforeMountScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('lifecycle.showBeforeMountScriptOption') as boolean ?? true;
};

export const showMountedScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('lifecycle.showMountedScriptOption') as boolean ?? true;
};

export const showBeforeUpdateScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('lifecycle.showBeforeUpdateScriptOption') as boolean ?? true;
};

export const showUpdatedScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('lifecycle.showUpdatedScriptOption') as boolean ?? true;
};

export const showActivatedScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('lifecycle.showActivatedScriptOption') as boolean ?? true;
};

export const showDeactivatedScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('lifecycle.showDeactivatedScriptOption') as boolean ?? true;
};

export const showBeforeUnmountScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('lifecycle.showBeforeUnmountScriptOption') as boolean ?? true;
};

export const showUnmountedScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('lifecycle.showUnmountedScriptOption') as boolean ?? true;
};

export const showErrorCapturedScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('lifecycle.showErrorCapturedScriptOption') as boolean ?? true;
};

export const showRenderTrackedScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('lifecycle.showRenderTrackedScriptOption') as boolean ?? true;
};

export const showRenderTriggeredScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('lifecycle.showRenderTriggeredScriptOption') as boolean ?? true;
};

export const showMethodsScriptOption = (): boolean => {
	config ??= loadWorkspaceConfig();
	return config?.get('option.showMethodsScriptOption') as boolean ?? true;
};