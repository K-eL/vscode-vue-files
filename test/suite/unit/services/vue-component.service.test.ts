/**
 * @fileoverview Unit tests for VueComponentService
 */
import { expect } from "chai";
import * as sinon from "sinon";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { VueComponentService } from "../../../../src/services/vue-component.service";
import { VueApiType } from "../../../../src/enums/vue-api-type.enum";
import { VueScriptLang } from "../../../../src/enums/vue-script-lang.enum";
import { VueStyleLang } from "../../../../src/enums/vue-style-lang.enum";
import { ConfigHelper } from "../../../../src/helpers/config.helper";

suite("VueComponentService", () => {
	let service: VueComponentService;
	let mockConfig: sinon.SinonStubbedInstance<ConfigHelper>;
	let tempDir: string;

	setup(() => {
		// Create temp directory for real file tests
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "vue-component-service-test-"));

		// Create mock config
		mockConfig = sinon.createStubInstance(ConfigHelper);

		// Setup menu config
		const menuConfig = {
			showCompositionApi: sinon.stub().returns(true),
			showOptionsApi: sinon.stub().returns(true),
			showTypescript: sinon.stub().returns(true),
			showJavascript: sinon.stub().returns(true),
			showScss: sinon.stub().returns(true),
			showCss: sinon.stub().returns(true),
		};
		(mockConfig as any).menu = menuConfig;

		// Setup other config methods
		(mockConfig as any).ind = sinon.stub().returns("  ");
		(mockConfig as any).isScriptFirst = sinon.stub().returns(false);
		(mockConfig as any).showVModelTemplate = sinon.stub().returns(true);

		// Script setup config
		const scriptSetupConfig = {
			useDefineModel: sinon.stub().returns(true),
			useWithDefaults: sinon.stub().returns(true),
			showDefineOptions: sinon.stub().returns(false),
			showDefineExpose: sinon.stub().returns(false),
			showDefineSlots: sinon.stub().returns(false),
		};
		(mockConfig as any).scriptSetup = scriptSetupConfig;

		// Options config
		const optionsConfig = {
			showName: sinon.stub().returns(true),
			showComponents: sinon.stub().returns(true),
			showDirectives: sinon.stub().returns(false),
			showExtends: sinon.stub().returns(false),
			showMixins: sinon.stub().returns(false),
			showProvideInject: sinon.stub().returns(false),
			showInheritAttrs: sinon.stub().returns(false),
			showProps: sinon.stub().returns(true),
			showEmits: sinon.stub().returns(true),
			showSetup: sinon.stub().returns(false),
			showData: sinon.stub().returns(true),
			showComputed: sinon.stub().returns(true),
			showWatch: sinon.stub().returns(true),
			showMethods: sinon.stub().returns(true),
		};
		(mockConfig as any).options = optionsConfig;

		// Lifecycle config
		const lifecycleConfig = {
			showHooks: sinon.stub().returns(true),
			showBeforeCreate: sinon.stub().returns(false),
			showCreated: sinon.stub().returns(false),
			showBeforeMount: sinon.stub().returns(false),
			showMounted: sinon.stub().returns(true),
			showBeforeUpdate: sinon.stub().returns(false),
			showUpdated: sinon.stub().returns(true),
			showActivated: sinon.stub().returns(false),
			showDeactivated: sinon.stub().returns(false),
			showBeforeUnmount: sinon.stub().returns(true),
			showUnmounted: sinon.stub().returns(false),
			showErrorCaptured: sinon.stub().returns(false),
			showRenderTracked: sinon.stub().returns(false),
			showRenderTriggered: sinon.stub().returns(false),
		};
		(mockConfig as any).lifecycle = lifecycleConfig;

		service = new VueComponentService(mockConfig as any);
	});

	teardown(() => {
		sinon.restore();
		// Cleanup temp directory
		if (fs.existsSync(tempDir)) {
			fs.rmSync(tempDir, { recursive: true, force: true });
		}
	});

	// ==========================================================================
	// normalizeVueComponentName
	// ==========================================================================

	suite("normalizeVueComponentName", () => {
		test("should convert to PascalCase", () => {
			expect(service.normalizeVueComponentName("my-component")).to.equal("MyComponent");
		});

		test("should handle already PascalCase", () => {
			expect(service.normalizeVueComponentName("MyComponent")).to.equal("Mycomponent");
		});

		test("should handle underscores", () => {
			expect(service.normalizeVueComponentName("my_component")).to.equal("MyComponent");
		});

		test("should handle spaces", () => {
			expect(service.normalizeVueComponentName("my component")).to.equal("MyComponent");
		});

		test("should remove .vue extension", () => {
			expect(service.normalizeVueComponentName("MyComponent.vue")).to.equal("Mycomponent");
		});

		test("should trim whitespace", () => {
			expect(service.normalizeVueComponentName("  MyComponent  ")).to.equal("Mycomponent");
		});

		test("should handle multiple hyphens", () => {
			expect(service.normalizeVueComponentName("my-awesome-component")).to.equal("MyAwesomeComponent");
		});

		test("should handle single word", () => {
			expect(service.normalizeVueComponentName("button")).to.equal("Button");
		});
	});

	// ==========================================================================
	// validateName
	// ==========================================================================

	suite("validateName", () => {
		test("should return error for empty name", () => {
			expect(service.validateName("")).to.equal("Component name is required");
		});

		test("should return error for whitespace-only name", () => {
			expect(service.validateName("   ")).to.equal("Component name is required");
		});

		test("should return error for name starting with number", () => {
			const result = service.validateName("123Component");
			expect(result).to.include("must start with a letter");
		});

		test("should return undefined for valid name", () => {
			expect(service.validateName("MyComponent")).to.be.undefined;
		});

		test("should return undefined for name with .vue extension", () => {
			expect(service.validateName("MyComponent.vue")).to.be.undefined;
		});

		test("should accept hyphens", () => {
			expect(service.validateName("my-component")).to.be.undefined;
		});

		test("should accept underscores", () => {
			expect(service.validateName("my_component")).to.be.undefined;
		});

		test("should reject special characters", () => {
			const result = service.validateName("my@component");
			expect(result).to.include("alphanumeric");
		});
	});

	// ==========================================================================
	// buildComponentSettings
	// ==========================================================================

	suite("buildComponentSettings", () => {
		test("should build settings with all parameters", () => {
			const settings = service.buildComponentSettings(
				"MyComponent",
				VueApiType.setup,
				VueScriptLang.typeScript,
				VueStyleLang.scss,
			);

			expect(settings.componentName).to.equal("MyComponent");
			expect(settings.apiType).to.equal(VueApiType.setup);
			expect(settings.scriptLang).to.equal(VueScriptLang.typeScript);
			expect(settings.styleLang).to.equal(VueStyleLang.scss);
		});

		test("should build settings for options API", () => {
			const settings = service.buildComponentSettings(
				"MyComponent",
				VueApiType.options,
				VueScriptLang.javaScript,
				VueStyleLang.css,
			);

			expect(settings.apiType).to.equal(VueApiType.options);
			expect(settings.scriptLang).to.equal(VueScriptLang.javaScript);
			expect(settings.styleLang).to.equal(VueStyleLang.css);
		});
	});

	// ==========================================================================
	// create - success cases
	// ==========================================================================

	suite("create", () => {
		test("should create Vue SFC file with Composition API + TypeScript", async () => {
			const result = await service.create({
				componentName: "my-component",
				targetDirectory: tempDir,
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.scss,
			});

			expect(result.success).to.be.true;
			expect(result.fileName).to.equal("MyComponent.vue");
			expect(result.filePath).to.equal(path.join(tempDir, "MyComponent.vue"));
			expect(fs.existsSync(result.filePath!)).to.be.true;
		});

		test("should create Vue SFC with composition script setup", async () => {
			const result = await service.create({
				componentName: "test-component",
				targetDirectory: tempDir,
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.scss,
			});

			const content = fs.readFileSync(result.filePath!, "utf8");
			expect(content).to.include("<script setup");
			expect(content).to.include("lang='ts'");
		});

		test("should create Vue SFC with options API", async () => {
			const result = await service.create({
				componentName: "test-component",
				targetDirectory: tempDir,
				apiType: VueApiType.options,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.scss,
			});

			const content = fs.readFileSync(result.filePath!, "utf8");
			expect(content).to.include("defineComponent");
			expect(content).to.include("export default");
		});

		test("should create Vue SFC with JavaScript", async () => {
			const result = await service.create({
				componentName: "test-component",
				targetDirectory: tempDir,
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.javaScript,
				styleLang: VueStyleLang.css,
			});

			const content = fs.readFileSync(result.filePath!, "utf8");
			expect(content).to.not.include("lang=\"ts\"");
		});

		test("should create subdirectory if it doesn't exist", async () => {
			const subDir = path.join(tempDir, "components");

			const result = await service.create({
				componentName: "test-component",
				targetDirectory: subDir,
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.scss,
			});

			expect(result.success).to.be.true;
			expect(fs.existsSync(subDir)).to.be.true;
		});

		test("should include template section", async () => {
			const result = await service.create({
				componentName: "test-component",
				targetDirectory: tempDir,
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.scss,
			});

			const content = fs.readFileSync(result.filePath!, "utf8");
			expect(content).to.include("<template>");
			expect(content).to.include("</template>");
		});

		test("should include style section with scoped", async () => {
			const result = await service.create({
				componentName: "test-component",
				targetDirectory: tempDir,
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.scss,
			});

			const content = fs.readFileSync(result.filePath!, "utf8");
			expect(content).to.include("<style");
			expect(content).to.include("scoped");
			expect(content).to.include("</style>");
		});
	});

	// ==========================================================================
	// create - error cases
	// ==========================================================================

	suite("create - error handling", () => {
		test("should return error if file already exists", async () => {
			// Create file first
			const fileName = "MyComponent.vue";
			fs.writeFileSync(path.join(tempDir, fileName), "existing content");

			const result = await service.create({
				componentName: "my-component",
				targetDirectory: tempDir,
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.scss,
			});

			expect(result.success).to.be.false;
			expect(result.fileExisted).to.be.true;
			expect(result.error).to.include("already exists");
		});

		test("should overwrite file if overwriteExisting is true", async () => {
			// Create file first
			const fileName = "MyComponent.vue";
			fs.writeFileSync(path.join(tempDir, fileName), "old content");

			const result = await service.create({
				componentName: "my-component",
				targetDirectory: tempDir,
				apiType: VueApiType.setup,
				scriptLang: VueScriptLang.typeScript,
				styleLang: VueStyleLang.scss,
				overwriteExisting: true,
			});

			expect(result.success).to.be.true;
			const content = fs.readFileSync(result.filePath!, "utf8");
			expect(content).to.not.equal("old content");
		});
	});

	// ==========================================================================
	// getQuickPickOptions
	// ==========================================================================

	suite("getQuickPickOptions", () => {
		test("should return all options when all menu items are visible", () => {
			const options = service.getQuickPickOptions();
			expect(options).to.have.length(4);
		});

		test("should include Composition API + TypeScript option", () => {
			const options = service.getQuickPickOptions();
			const compositionTs = options.find(
				(o) => o.apiType === VueApiType.setup && o.scriptLang === VueScriptLang.typeScript,
			);

			expect(compositionTs).to.exist;
			expect(compositionTs!.label).to.include("Composition");
			expect(compositionTs!.label).to.include("TypeScript");
		});

		test("should include Options API + JavaScript option", () => {
			const options = service.getQuickPickOptions();
			const optionsJs = options.find(
				(o) => o.apiType === VueApiType.options && o.scriptLang === VueScriptLang.javaScript,
			);

			expect(optionsJs).to.exist;
			expect(optionsJs!.label).to.include("Options");
			expect(optionsJs!.label).to.include("JavaScript");
		});

		test("should not include Composition API when hidden", () => {
			(mockConfig as any).menu.showCompositionApi.returns(false);

			const options = service.getQuickPickOptions();
			const compositionOptions = options.filter((o) => o.apiType === VueApiType.setup);

			expect(compositionOptions).to.have.length(0);
		});

		test("should not include TypeScript options when hidden", () => {
			(mockConfig as any).menu.showTypescript.returns(false);

			const options = service.getQuickPickOptions();
			const tsOptions = options.filter((o) => o.scriptLang === VueScriptLang.typeScript);

			expect(tsOptions).to.have.length(0);
		});

		test("should return empty array when all options are hidden", () => {
			(mockConfig as any).menu.showCompositionApi.returns(false);
			(mockConfig as any).menu.showOptionsApi.returns(false);

			const options = service.getQuickPickOptions();
			expect(options).to.have.length(0);
		});
	});
});
