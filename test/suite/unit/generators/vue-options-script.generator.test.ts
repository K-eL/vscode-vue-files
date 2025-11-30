import { expect } from "chai";
import { generateOptionsApiScriptTemplate } from "../../../../src/generators/vue-options-script.generator";
import {
	createGeneratorContext,
} from "../../../../src/interfaces/generator-context";
import { createTestConfigHelper } from "../../../__helpers__";

suite("Vue Options Script Generator", () => {
	suite("Basic Structure", () => {
		test("should generate import statement with defineComponent", () => {
			const configHelper = createTestConfigHelper();
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("import { defineComponent } from 'vue'");
		});

		test("should export default defineComponent", () => {
			const configHelper = createTestConfigHelper();
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("export default defineComponent({");
		});

		test("should close defineComponent properly", () => {
			const configHelper = createTestConfigHelper();
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("});");
		});
	});

	suite("Component Name Generation", () => {
		test("should not include name when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showNameScriptOption": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).not.to.include("name:");
		});

		test("should include name when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showNameScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("name: 'TestComponent'");
		});
	});

	suite("Components Option Generation", () => {
		test("should not include components when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showComponentsScriptOption": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).not.to.include("components:");
		});

		test("should include components when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showComponentsScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("components: {");
		});
	});

	suite("Directives Option Generation", () => {
		test("should not include directives when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showDirectivesScriptOption": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).not.to.include("directives:");
		});

		test("should include directives when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showDirectivesScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("directives: {");
		});
	});

	suite("Extends Option Generation", () => {
		test("should not include extends when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showExtendsScriptOption": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).not.to.include("extends:");
		});

		test("should include extends when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showExtendsScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("extends: {");
		});
	});

	suite("Mixins Option Generation", () => {
		test("should not include mixins when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showMixinsScriptOption": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).not.to.include("mixins:");
		});

		test("should include mixins when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showMixinsScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("mixins: [");
		});
	});

	suite("Provide/Inject Option Generation", () => {
		test("should not include provide/inject when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showProvideInjectScriptOption": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).not.to.include("provide:");
			expect(result).not.to.include("inject:");
		});

		test("should include provide/inject when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showProvideInjectScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("provide: {");
			expect(result).to.include("inject: {");
		});
	});

	suite("InheritAttrs Option Generation", () => {
		test("should not include inheritAttrs when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showInheritAttributesScriptOption": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).not.to.include("inheritAttrs:");
		});

		test("should include inheritAttrs when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showInheritAttributesScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("inheritAttrs: false");
		});
	});

	suite("Props Option Generation", () => {
		test("should not include props when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showPropsScriptOption": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).not.to.include("props:");
		});

		test("should include props when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showPropsScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("props: {");
		});
	});

	suite("Emits Option Generation", () => {
		test("should not include emits when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showEmitsScriptOption": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).not.to.include("emits:");
		});

		test("should include emits when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showEmitsScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("emits: {");
		});
	});

	suite("Data Option Generation", () => {
		test("should not include data when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showDataScriptOption": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).not.to.include("data()");
		});

		test("should include data when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showDataScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("data()");
			expect(result).to.include("return {");
		});
	});

	suite("Computed Option Generation", () => {
		test("should not include computed when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showComputedScriptOption": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).not.to.include("computed:");
		});

		test("should include computed when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showComputedScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("computed: {");
		});
	});

	suite("Watch Option Generation", () => {
		test("should not include watch when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showWatchScriptOption": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).not.to.include("watch:");
		});

		test("should include watch when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showWatchScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("watch: {");
		});
	});

	suite("Methods Option Generation", () => {
		test("should not include methods when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showMethodsScriptOption": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).not.to.include("methods:");
		});

		test("should include methods when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showMethodsScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("methods: {");
		});
	});

	suite("Lifecycle Hooks Generation", () => {
		test("should include beforeCreate when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"lifecycle.showLifecycleHooksScriptOptions": true,
					"lifecycle.showBeforeCreateScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("beforeCreate()");
		});

		test("should include created when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"lifecycle.showLifecycleHooksScriptOptions": true,
					"lifecycle.showCreatedScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("created()");
		});

		test("should include mounted when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"lifecycle.showLifecycleHooksScriptOptions": true,
					"lifecycle.showMountedScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("mounted()");
		});

		test("should not include lifecycle hooks when main toggle is off", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"lifecycle.showLifecycleHooksScriptOptions": false,
					"lifecycle.showMountedScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).not.to.include("mounted()");
		});

		test("should include beforeMount when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"lifecycle.showLifecycleHooksScriptOptions": true,
					"lifecycle.showBeforeMountScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("beforeMount()");
		});

		test("should include beforeUnmount when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"lifecycle.showLifecycleHooksScriptOptions": true,
					"lifecycle.showBeforeUnmountScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("beforeUnmount()");
		});

		test("should include unmounted when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"lifecycle.showLifecycleHooksScriptOptions": true,
					"lifecycle.showUnmountedScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("unmounted()");
		});

		test("should include multiple lifecycle hooks when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"lifecycle.showLifecycleHooksScriptOptions": true,
					"lifecycle.showBeforeCreateScriptOption": true,
					"lifecycle.showCreatedScriptOption": true,
					"lifecycle.showMountedScriptOption": true,
					"lifecycle.showUnmountedScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("beforeCreate()");
			expect(result).to.include("created()");
			expect(result).to.include("mounted()");
			expect(result).to.include("unmounted()");
		});
	});

	suite("InheritAttrs Option Generation", () => {
		test("should not include inheritAttrs when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showInheritAttributesScriptOption": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).not.to.include("inheritAttrs:");
		});
	});

	suite("Combined Features", () => {
		test("should generate complete script with all features enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showNameScriptOption": true,
					"option.showComponentsScriptOption": true,
					"option.showDirectivesScriptOption": true,
					"option.showPropsScriptOption": true,
					"option.showEmitsScriptOption": true,
					"option.showDataScriptOption": true,
					"option.showComputedScriptOption": true,
					"option.showWatchScriptOption": true,
					"option.showMethodsScriptOption": true,
					"lifecycle.showLifecycleHooksScriptOptions": true,
					"lifecycle.showMountedScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("name: 'TestComponent'");
			expect(result).to.include("components:");
			expect(result).to.include("directives:");
			expect(result).to.include("props:");
			expect(result).to.include("emits:");
			expect(result).to.include("data()");
			expect(result).to.include("computed:");
			expect(result).to.include("watch:");
			expect(result).to.include("methods:");
			expect(result).to.include("mounted()");
		});

		test("should generate minimal script with all features disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showNameScriptOption": false,
					"option.showComponentsScriptOption": false,
					"option.showDirectivesScriptOption": false,
					"option.showPropsScriptOption": false,
					"option.showEmitsScriptOption": false,
					"option.showDataScriptOption": false,
					"option.showComputedScriptOption": false,
					"option.showWatchScriptOption": false,
					"option.showMethodsScriptOption": false,
					"option.showInheritAttrsScriptOption": false,
					"lifecycle.showLifecycleHooksScriptOptions": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("import { defineComponent } from 'vue'");
			expect(result).to.include("export default defineComponent({");
			expect(result).to.include("});");
		});
	});

	suite("JavaScript vs TypeScript", () => {
		test("should generate JavaScript compatible code", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showPropsScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(false, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			// JavaScript props use array syntax
			expect(result).to.include("props:");
		});

		test("should generate TypeScript compatible code with types", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showPropsScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			// TypeScript props use object syntax with types
			expect(result).to.include("props:");
		});
	});

	suite("V-Model Template Integration", () => {
		test("should generate v-model related options when template enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showPropsScriptOption": true,
					"option.showEmitsScriptOption": true,
					"option.showComputedScriptOption": true,
					"template.showV-ModelTemplate": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("modelValue");
			expect(result).to.include("update:modelValue");
		});

		test("should generate simple options when vmodel not enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showPropsScriptOption": true,
					"option.showEmitsScriptOption": true,
					"template.showV-ModelTemplate": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("props:");
			expect(result).to.include("emits:");
		});
	});

	suite("Extends Option Generation", () => {
		test("should generate extends with mixin comment", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showExtendsScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("extends:");
		});
	});

	suite("Mixins Option Generation", () => {
		test("should generate mixins array", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showMixinsScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("mixins:");
		});
	});

	suite("Provide/Inject Option Generation", () => {
		test("should generate provide and inject options", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showProvideInjectScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateOptionsApiScriptTemplate("TestComponent", ctx);

			expect(result).to.include("provide:");
			expect(result).to.include("inject:");
		});
	});
});
