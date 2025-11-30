/**
 * @fileoverview Mock utilities for VS Code API testing
 * Provides mock implementations for common VS Code APIs used in commands
 */
import * as vscode from "vscode";
import * as sinon from "sinon";

/**
 * Creates a mock for vscode.window.showInputBox
 * @param sandbox - Sinon sandbox for automatic cleanup
 * @param returnValue - Value to return when showInputBox is called
 */
export function mockShowInputBox(
	sandbox: sinon.SinonSandbox,
	returnValue: string | undefined,
): sinon.SinonStub {
	return sandbox.stub(vscode.window, "showInputBox").resolves(returnValue);
}

/**
 * Creates a mock for vscode.window.showQuickPick that returns specific item
 * @param sandbox - Sinon sandbox for automatic cleanup
 * @param returnValue - QuickPickItem to return
 */
export function mockShowQuickPick<T extends vscode.QuickPickItem>(
	sandbox: sinon.SinonSandbox,
	returnValue: T | undefined,
): sinon.SinonStub {
	return sandbox
		.stub(vscode.window, "showQuickPick")
		.resolves(returnValue as vscode.QuickPickItem | undefined);
}

/**
 * Creates a mock for vscode.window.showInformationMessage
 */
export function mockShowInformationMessage(
	sandbox: sinon.SinonSandbox,
	returnValue?: string,
): sinon.SinonStub {
	return sandbox
		.stub(vscode.window, "showInformationMessage")
		.resolves(returnValue as unknown as vscode.MessageItem | undefined);
}

/**
 * Creates a mock for vscode.window.showErrorMessage
 */
export function mockShowErrorMessage(
	sandbox: sinon.SinonSandbox,
	returnValue?: string,
): sinon.SinonStub {
	return sandbox
		.stub(vscode.window, "showErrorMessage")
		.resolves(returnValue as unknown as vscode.MessageItem | undefined);
}

/**
 * Creates a mock for vscode.window.showWarningMessage
 */
export function mockShowWarningMessage(
	sandbox: sinon.SinonSandbox,
	returnValue?: string,
): sinon.SinonStub {
	return sandbox
		.stub(vscode.window, "showWarningMessage")
		.resolves(returnValue as unknown as vscode.MessageItem | undefined);
}

/**
 * Creates a mock for vscode.workspace.openTextDocument
 */
export function mockOpenTextDocument(
	sandbox: sinon.SinonSandbox,
	mockPath = "/mock/path/file.ts",
): sinon.SinonStub {
	const mockDocument = {
		uri: { fsPath: mockPath },
		getText: () => "",
		lineCount: 1,
	} as unknown as vscode.TextDocument;

	return sandbox
		.stub(vscode.workspace, "openTextDocument")
		.resolves(mockDocument);
}

/**
 * Creates a mock for vscode.window.showTextDocument
 */
export function mockShowTextDocument(
	sandbox: sinon.SinonSandbox,
): sinon.SinonStub {
	const mockEditor = {
		document: { uri: { fsPath: "/mock/path" } },
	} as unknown as vscode.TextEditor;

	return sandbox.stub(vscode.window, "showTextDocument").resolves(mockEditor);
}

/**
 * Mock type for workspace folders
 */
export interface MockWorkspaceFolder {
	uri: { fsPath: string };
	name: string;
	index: number;
}

/**
 * Creates mock workspace folders
 */
export function createMockWorkspaceFolders(
	paths: string[],
): MockWorkspaceFolder[] {
	return paths.map((fsPath, index) => ({
		uri: { fsPath },
		name: `workspace-${index}`,
		index,
	}));
}
