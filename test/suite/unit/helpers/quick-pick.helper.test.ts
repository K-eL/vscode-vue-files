import { expect } from "chai";
import * as sinon from "sinon";
import * as vscode from "vscode";
import {
	QuickPickHelper,
	type TemplateChoice,
} from "../../../../src/helpers/quick-pick.helper";
import { VueApiType } from "../../../../src/enums/vue-api-type.enum";
import { VueScriptLang } from "../../../../src/enums/vue-script-lang.enum";
import { VueStyleLang } from "../../../../src/enums/vue-style-lang.enum";
import { mockShowQuickPick, createTestConfigHelper } from "../../../__helpers__";

suite("Quick Pick Helper", () => {
	let sandbox: sinon.SinonSandbox;
	let mockContext: vscode.ExtensionContext;
	let workspaceState: Map<string, unknown>;

	setup(() => {
		sandbox = sinon.createSandbox();
		workspaceState = new Map();

		// Create mock extension context
		mockContext = {
			workspaceState: {
				get: <T>(key: string): T | undefined => workspaceState.get(key) as T,
				update: (key: string, value: unknown) => {
					workspaceState.set(key, value);
					return Promise.resolve();
				},
				keys: () => Array.from(workspaceState.keys()),
			},
			globalState: {
				get: () => undefined,
				update: () => Promise.resolve(),
				keys: () => [],
				setKeysForSync: () => {},
			},
			subscriptions: [],
			extensionPath: "/mock/path",
			extensionUri: vscode.Uri.file("/mock/path"),
			storagePath: "/mock/storage",
			storageUri: vscode.Uri.file("/mock/storage"),
			globalStoragePath: "/mock/global",
			globalStorageUri: vscode.Uri.file("/mock/global"),
			logPath: "/mock/log",
			logUri: vscode.Uri.file("/mock/log"),
			extensionMode: vscode.ExtensionMode.Test,
			extension: {} as vscode.Extension<unknown>,
			asAbsolutePath: (path: string) => path,
			environmentVariableCollection: {} as vscode.GlobalEnvironmentVariableCollection,
			secrets: {} as vscode.SecretStorage,
			languageModelAccessInformation: {} as vscode.LanguageModelAccessInformation,
		} as unknown as vscode.ExtensionContext;

		// Setup default config helper with all options enabled
		createTestConfigHelper({
			configOverrides: {
				"contextMenu.showCompositionApi": true,
				"contextMenu.showOptionsApi": true,
				"contextMenu.showTypeScript": true,
				"contextMenu.showJavaScript": true,
				"contextMenu.showScss": true,
				"contextMenu.showCss": true,
			},
		});
	});

	teardown(() => {
		sandbox.restore();
	});

	suite("constructor", () => {
		test("should create instance with context", () => {
			const helper = new QuickPickHelper(mockContext);
			expect(helper).to.be.instanceOf(QuickPickHelper);
		});
	});

	suite("showTemplateQuickPick", () => {
		test("should return undefined when user cancels", async () => {
			mockShowQuickPick(sandbox, undefined);

			const helper = new QuickPickHelper(mockContext);
			const result = await helper.showTemplateQuickPick();

			expect(result).to.be.undefined;
		});

		test("should return template choice when user selects", async () => {
			const selectedItem = {
				label: "Composition API (Setup) + TypeScript + SCSS",
				description: "Modern Vue 3 with TypeScript and SCSS",
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.scss,
			};

			mockShowQuickPick(sandbox, selectedItem);

			const helper = new QuickPickHelper(mockContext);
			const result = await helper.showTemplateQuickPick();

			expect(result).to.not.be.undefined;
			expect(result?.apiType).to.equal(VueApiType.setup);
			expect(result?.scriptLang).to.equal(VueScriptLang.typeScript);
			expect(result?.styleLang).to.equal(VueStyleLang.scss);
		});

		test("should return undefined when separator is selected", async () => {
			const separatorItem = {
				label: "Recently Used",
				kind: vscode.QuickPickItemKind.Separator,
			};

			mockShowQuickPick(sandbox, separatorItem);

			const helper = new QuickPickHelper(mockContext);
			const result = await helper.showTemplateQuickPick();

			expect(result).to.be.undefined;
		});

		test("should remove clock icon from recently used template label", async () => {
			const recentItem = {
				label: "$(clock) Composition API (Setup) + TypeScript + SCSS",
				description: "Modern Vue 3 with TypeScript and SCSS",
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.scss,
			};

			mockShowQuickPick(sandbox, recentItem);

			const helper = new QuickPickHelper(mockContext);
			const result = await helper.showTemplateQuickPick();

			expect(result?.label).to.not.include("$(clock)");
			expect(result?.label).to.equal(
				"Composition API (Setup) + TypeScript + SCSS",
			);
		});
	});

	suite("clearRecentTemplates", () => {
		test("should clear recent templates from workspace state", () => {
			// Add some recent templates
			workspaceState.set("vscode-vue-files.recentTemplates", [
				{
					label: "Test Template",
					apiType: VueApiType.setup,
					scriptLang: VueScriptLang.typeScript,
					styleLang: VueStyleLang.scss,
					lastUsed: Date.now(),
				},
			]);

			const helper = new QuickPickHelper(mockContext);
			helper.clearRecentTemplates();

			const recent = workspaceState.get("vscode-vue-files.recentTemplates");
			expect(recent).to.deep.equal([]);
		});
	});

	suite("TemplateChoice interface", () => {
		test("should have all required properties", () => {
			const template: TemplateChoice = {
				label: "Test",
				description: "Test description",
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.scss,
			};

			expect(template).to.have.property("label");
			expect(template).to.have.property("description");
			expect(template).to.have.property("apiType");
			expect(template).to.have.property("scriptLang");
			expect(template).to.have.property("styleLang");
		});
	});
});
