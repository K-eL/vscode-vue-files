import * as vscode from "vscode";
import { VueApiType } from "../enums/vue-api-type.enum";
import { VueScriptLang } from "../enums/vue-script-lang.enum";
import { VueStyleLang } from "../enums/vue-style-lang.enum";
import { PiniaStoreType } from "../enums/pinia-store-type.enum";
import { ComposablePattern } from "../enums/composable-pattern.enum";
import { generateContent } from "../generators/content.generator";
import { generatePiniaStore } from "../generators/pinia-store.generator";
import { generateComposable } from "../generators/composable.generator";
import { createFile } from "../helpers/file.helper";
import { FileSettings } from "../interfaces/file-settings";
import { ConfigHelper } from "../helpers/config.helper";

/**
 * Creates all possible file variations for manual testing.
 * 
 * Generated structure:
 * ```
 * test-output/
 * ├── components/
 * │   ├── composition-api/
 * │   │   ├── setup-ts-css.vue
 * │   │   ├── setup-ts-scss.vue
 * │   │   ├── setup-js-css.vue
 * │   │   └── setup-js-scss.vue
 * │   └── options-api/
 * │   │   ├── options-ts-css.vue
 * │   │   ├── options-ts-scss.vue
 * │   │   ├── options-js-css.vue
 * │   │   └── options-js-scss.vue
 * ├── stores/
 * │   ├── setup-store.ts
 * │   ├── options-store.ts
 * │   ├── setup-store-no-examples.ts
 * │   └── options-store-no-examples.ts
 * └── composables/
 *     ├── useState.ts
 *     ├── useFetch.ts
 *     ├── useEventListener.ts
 *     ├── useCustom.ts
 *     └── js/
 *         ├── useState.js
 *         ├── useFetch.js
 *         ├── useEventListener.js
 *         └── useCustom.js
 * ```
 */
export const createFilesForTestCommand = async (uri: vscode.Uri) => {
	// loads/updates workspace config
	const configHelper = new ConfigHelper();

	// if uri contains a file, use the parent folder
	if (uri.fsPath.includes(".")) {
		uri = uri.with({
			path: uri.path.replace(uri.fsPath.split("/").pop() as string, ""),
		});
	}

	const baseUri = uri.with({ path: `${uri.path}/test-output` });
	const createdFiles: vscode.Uri[] = [];

	// =========================================================================
	// 1. Vue Components
	// =========================================================================
	await createVueComponents(baseUri, configHelper, createdFiles);

	// =========================================================================
	// 2. Pinia Stores
	// =========================================================================
	await createPiniaStores(baseUri, createdFiles);

	// =========================================================================
	// 3. Composables
	// =========================================================================
	await createComposables(baseUri, createdFiles);

	// =========================================================================
	// 4. Show summary
	// =========================================================================
	await showTestSummary(createdFiles, baseUri);
};

/**
 * Creates all Vue component variations
 */
async function createVueComponents(
	baseUri: vscode.Uri,
	configHelper: ConfigHelper,
	createdFiles: vscode.Uri[],
): Promise<void> {
	const componentsUri = baseUri.with({ path: `${baseUri.path}/components` });

	for (const apiType of Object.values(VueApiType)) {
		const isSetup = VueApiType[apiType] === VueApiType.setup;
		const apiFolder = isSetup ? "composition-api" : "options-api";
		const apiUri = componentsUri.with({
			path: `${componentsUri.path}/${apiFolder}`,
		});

		for (const scriptLang of Object.values(VueScriptLang)) {
			const langUri = apiUri.with({ path: `${apiUri.path}` });

			for (const styleLang of Object.values(VueStyleLang)) {
				const fileName = `${isSetup ? "setup" : "options"}-${scriptLang}-${styleLang}.vue`;

				const newFileSettings: FileSettings = {
					isSetupApi: isSetup,
					scriptLang,
					styleLang,
					componentName: "TestComponent",
				};

				const fileContent = generateContent(newFileSettings, configHelper);
				const newFileUri = langUri.with({ path: `${langUri.path}/${fileName}` });

				await createFile(newFileUri, fileContent);
				createdFiles.push(newFileUri);
			}
		}
	}
}

/**
 * Creates all Pinia store variations
 */
async function createPiniaStores(
	baseUri: vscode.Uri,
	createdFiles: vscode.Uri[],
): Promise<void> {
	const storesUri = baseUri.with({ path: `${baseUri.path}/stores` });

	const storeVariations = [
		{
			name: "example",
			type: PiniaStoreType.setup,
			examples: true,
			fileName: "example-setup.store.ts",
		},
		{
			name: "example",
			type: PiniaStoreType.options,
			examples: true,
			fileName: "example-options.store.ts",
		},
		{
			name: "minimal",
			type: PiniaStoreType.setup,
			examples: false,
			fileName: "minimal-setup.store.ts",
		},
		{
			name: "minimal",
			type: PiniaStoreType.options,
			examples: false,
			fileName: "minimal-options.store.ts",
		},
	];

	for (const variation of storeVariations) {
		const content = generatePiniaStore({
			name: variation.name,
			type: variation.type,
			includeExampleState: variation.examples,
			includeExampleGetter: variation.examples,
			includeExampleAction: variation.examples,
		});

		const fileUri = storesUri.with({
			path: `${storesUri.path}/${variation.fileName}`,
		});
		await createFile(fileUri, content);
		createdFiles.push(fileUri);
	}
}

/**
 * Creates all composable variations
 */
async function createComposables(
	baseUri: vscode.Uri,
	createdFiles: vscode.Uri[],
): Promise<void> {
	const composablesUri = baseUri.with({ path: `${baseUri.path}/composables` });

	const patterns = [
		{ pattern: ComposablePattern.useState, name: "state" },
		{ pattern: ComposablePattern.useFetch, name: "fetch" },
		{ pattern: ComposablePattern.useEventListener, name: "eventListener" },
		{ pattern: ComposablePattern.custom, name: "custom" },
	];

	// TypeScript versions
	const tsUri = composablesUri.with({ path: `${composablesUri.path}/ts` });
	for (const { pattern, name } of patterns) {
		const content = generateComposable({
			name,
			pattern,
			useGenerics: true,
		});

		const fileName = `use${name.charAt(0).toUpperCase() + name.slice(1)}.ts`;
		const fileUri = tsUri.with({ path: `${tsUri.path}/${fileName}` });
		await createFile(fileUri, content);
		createdFiles.push(fileUri);
	}

	// JavaScript versions
	const jsUri = composablesUri.with({ path: `${composablesUri.path}/js` });
	for (const { pattern, name } of patterns) {
		const content = generateComposable({
			name,
			pattern,
			useGenerics: false,
		});

		const fileName = `use${name.charAt(0).toUpperCase() + name.slice(1)}.js`;
		const fileUri = jsUri.with({ path: `${jsUri.path}/${fileName}` });
		await createFile(fileUri, content);
		createdFiles.push(fileUri);
	}
}

/**
 * Shows a summary of created files and opens the first one
 */
async function showTestSummary(
	createdFiles: vscode.Uri[],
	baseUri: vscode.Uri,
): Promise<void> {
	// Count by type
	const vueFiles = createdFiles.filter((f) => f.fsPath.endsWith(".vue")).length;
	const storeFiles = createdFiles.filter((f) =>
		f.fsPath.includes("/stores/"),
	).length;
	const composableFiles = createdFiles.filter((f) =>
		f.fsPath.includes("/composables/"),
	).length;

	const message = `✅ Test files created!\n\n` +
		`📁 Location: ${baseUri.fsPath}\n\n` +
		`📊 Summary:\n` +
		`   • ${vueFiles} Vue components\n` +
		`   • ${storeFiles} Pinia stores\n` +
		`   • ${composableFiles} Composables\n` +
		`   • ${createdFiles.length} total files`;

	const action = await vscode.window.showInformationMessage(
		`Created ${createdFiles.length} test files`,
		"Open Folder",
		"Open First File",
	);

	if (action === "Open Folder") {
		// Reveal folder in explorer
		await vscode.commands.executeCommand("revealInExplorer", baseUri);
	} else if (action === "Open First File" && createdFiles.length > 0) {
		const document = await vscode.workspace.openTextDocument(createdFiles[0]);
		await vscode.window.showTextDocument(document);
	}

	// Log summary to output channel
	const outputChannel = vscode.window.createOutputChannel("Vue Files Test");
	outputChannel.appendLine(message);
	outputChannel.appendLine("\n📄 Created files:");
	createdFiles.forEach((f) => outputChannel.appendLine(`   ${f.fsPath}`));
	outputChannel.show(true);
}
