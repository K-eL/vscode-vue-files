import { expect } from "chai";
import * as vscode from "vscode";
import { generateContent } from "../../../src/generators/content.generator";
import { ConfigHelper } from "../../../src/helpers/config.helper";
import { FileSettings } from "../../../src/interfaces/file-settings";
import { VueApiType } from "../../../src/enums/vue-api-type.enum";
import { VueScriptLang } from "../../../src/enums/vue-script-lang.enum";
import { VueStyleLang } from "../../../src/enums/vue-style-lang.enum";

suite("Content Generator", () => {
	let configHelper: ConfigHelper;

	const createMockedConfig = (overrides: Record<string, unknown> = {}): vscode.WorkspaceConfiguration => ({
		get: (key: string) => {
			const defaults: Record<string, unknown> = {
				"fileStructure.scriptTagComesFirst": false,
				"template.showV-ModelTemplate": false,
				"option.showNameScriptOption": true,
				"option.showComponentsScriptOption": false,
				"option.showDirectivesScriptOption": false,
				"option.showExtendsScriptOption": false,
				"option.showMixinsScriptOption": false,
				"option.showProvideInjectScriptOption": false,
				"option.showInheritAttributesScriptOption": false,
				"option.showPropsScriptOption": false,
				"option.showEmitsScriptOption": false,
				"option.showSetupScriptOption": false,
				"option.showDataScriptOption": false,
				"option.showComputedScriptOption": false,
				"option.showWatchScriptOption": false,
				"option.showMethodsScriptOption": false,
				"lifecycle.showLifecycleHooksScriptOptions": false,
				"lifecycle.showMountedScriptOption": false,
				"lifecycle.showUpdatedScriptOption": false,
				"lifecycle.showBeforeUnmountScriptOption": false,
				"scriptSetup.useDefineModel": false,
				"scriptSetup.useWithDefaults": false,
				"scriptSetup.showDefineOptions": false,
				"scriptSetup.showDefineExpose": false,
				"scriptSetup.showDefineSlots": false,
				...overrides,
			};
			return defaults[key] ?? null;
		},
		has: () => true,
		update: () => Promise.resolve(),
		inspect: () => undefined,
	});

	const createEditorConfig = (): vscode.WorkspaceConfiguration => ({
		get: (key: string) => {
			if (key === "insertSpaces") return false;
			if (key === "tabSize") return 2;
			return null;
		},
		has: () => true,
		update: () => Promise.resolve(),
		inspect: () => undefined,
	});

	setup(() => {
		configHelper = new ConfigHelper();
		configHelper["_editorConfig"] = createEditorConfig();
		configHelper["_vueFilesConfig"] = createMockedConfig();
	});

	suite("File Structure", () => {
		test("should generate template first by default", () => {
			const fileSettings: FileSettings = {
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.scss,
				componentName: "TestComponent",
			};

			const result = generateContent(fileSettings, configHelper);

			const templateIndex = result.indexOf("<template>");
			const scriptIndex = result.indexOf("<script");
			expect(templateIndex).to.be.lessThan(scriptIndex);
		});

		test("should generate script first when configured", () => {
			configHelper["_vueFilesConfig"] = createMockedConfig({
				"fileStructure.scriptTagComesFirst": true,
			});

			const fileSettings: FileSettings = {
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.scss,
				componentName: "TestComponent",
			};

			const result = generateContent(fileSettings, configHelper);

			const templateIndex = result.indexOf("<template>");
			const scriptIndex = result.indexOf("<script");
			expect(scriptIndex).to.be.lessThan(templateIndex);
		});
	});

	suite("Script Tag Generation", () => {
		test("should generate setup script tag for Composition API", () => {
			const fileSettings: FileSettings = {
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.css,
				componentName: "TestComponent",
			};

			const result = generateContent(fileSettings, configHelper);

			expect(result).to.include("<script setup lang='ts'>");
		});

		test("should generate regular script tag for Options API", () => {
			const fileSettings: FileSettings = {
				apiType: VueApiType.options,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.css,
				componentName: "TestComponent",
			};

			const result = generateContent(fileSettings, configHelper);

			expect(result).to.include("<script lang='ts'>");
			expect(result).not.to.include("<script setup");
		});

		test("should use js lang for JavaScript", () => {
			const fileSettings: FileSettings = {
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.javaScript,
				styleLang: VueStyleLang.css,
				componentName: "TestComponent",
			};

			const result = generateContent(fileSettings, configHelper);

			expect(result).to.include("<script setup lang='js'>");
		});
	});

	suite("Style Tag Generation", () => {
		test("should generate SCSS style tag", () => {
			const fileSettings: FileSettings = {
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.scss,
				componentName: "TestComponent",
			};

			const result = generateContent(fileSettings, configHelper);

			expect(result).to.include('<style scoped lang="scss">');
		});

		test("should generate CSS style tag", () => {
			const fileSettings: FileSettings = {
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.css,
				componentName: "TestComponent",
			};

			const result = generateContent(fileSettings, configHelper);

			expect(result).to.include('<style scoped lang="css">');
		});
	});

	suite("Template Generation", () => {
		test("should generate basic template structure", () => {
			const fileSettings: FileSettings = {
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.css,
				componentName: "TestComponent",
			};

			const result = generateContent(fileSettings, configHelper);

			expect(result).to.include("<template>");
			expect(result).to.include("</template>");
			expect(result).to.include("<div>");
			expect(result).to.include("</div>");
		});

		test("should generate v-model template when enabled", () => {
			configHelper["_vueFilesConfig"] = createMockedConfig({
				"template.showV-ModelTemplate": true,
				"scriptSetup.useDefineModel": true,
			});

			const fileSettings: FileSettings = {
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.css,
				componentName: "TestComponent",
			};

			const result = generateContent(fileSettings, configHelper);

			expect(result).to.include("v-model");
		});
	});

	suite("Options API Generation", () => {
		test("should include defineComponent import for Options API", () => {
			const fileSettings: FileSettings = {
				apiType: VueApiType.options,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.css,
				componentName: "TestComponent",
			};

			const result = generateContent(fileSettings, configHelper);

			expect(result).to.include("import { defineComponent } from 'vue'");
			expect(result).to.include("export default defineComponent({");
		});

		test("should include component name when enabled", () => {
			configHelper["_vueFilesConfig"] = createMockedConfig({
				"option.showNameScriptOption": true,
			});

			const fileSettings: FileSettings = {
				apiType: VueApiType.options,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.css,
				componentName: "MyComponent",
			};

			const result = generateContent(fileSettings, configHelper);

			expect(result).to.include("name: 'MyComponent'");
		});
	});

	suite("Composition API Generation", () => {
		test("should generate vue imports for Composition API", () => {
			configHelper["_vueFilesConfig"] = createMockedConfig({
				"option.showComputedScriptOption": true,
				"option.showWatchScriptOption": true,
			});

			const fileSettings: FileSettings = {
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.css,
				componentName: "TestComponent",
			};

			const result = generateContent(fileSettings, configHelper);

			expect(result).to.include("import {");
			expect(result).to.include("computed");
			expect(result).to.include("watch");
			expect(result).to.include("} from 'vue'");
		});

		test("should include lifecycle hooks when enabled", () => {
			configHelper["_vueFilesConfig"] = createMockedConfig({
				"lifecycle.showLifecycleHooksScriptOptions": true,
				"lifecycle.showMountedScriptOption": true,
			});

			const fileSettings: FileSettings = {
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.css,
				componentName: "TestComponent",
			};

			const result = generateContent(fileSettings, configHelper);

			expect(result).to.include("onMounted");
		});
	});

	suite("Script Setup Macros", () => {
		test("should include defineOptions when enabled", () => {
			configHelper["_vueFilesConfig"] = createMockedConfig({
				"scriptSetup.showDefineOptions": true,
			});

			const fileSettings: FileSettings = {
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.css,
				componentName: "TestComponent",
			};

			const result = generateContent(fileSettings, configHelper);

			expect(result).to.include("defineOptions({");
		});

		test("should include defineExpose when enabled", () => {
			configHelper["_vueFilesConfig"] = createMockedConfig({
				"scriptSetup.showDefineExpose": true,
			});

			const fileSettings: FileSettings = {
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.css,
				componentName: "TestComponent",
			};

			const result = generateContent(fileSettings, configHelper);

			expect(result).to.include("defineExpose({");
		});

		test("should include defineSlots when enabled", () => {
			configHelper["_vueFilesConfig"] = createMockedConfig({
				"scriptSetup.showDefineSlots": true,
			});

			const fileSettings: FileSettings = {
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.css,
				componentName: "TestComponent",
			};

			const result = generateContent(fileSettings, configHelper);

			expect(result).to.include("defineSlots");
		});

		test("should include defineModel when enabled with v-model template", () => {
			configHelper["_vueFilesConfig"] = createMockedConfig({
				"template.showV-ModelTemplate": true,
				"scriptSetup.useDefineModel": true,
			});

			const fileSettings: FileSettings = {
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.css,
				componentName: "TestComponent",
			};

			const result = generateContent(fileSettings, configHelper);

			expect(result).to.include("defineModel");
		});
	});
});
