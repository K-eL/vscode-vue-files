import { expect } from "chai";
import { generateCompositionApiScriptTemplate } from "../../../../src/generators/vue-composition-script.generator";
import {
	createGeneratorContext,
} from "../../../../src/interfaces/generator-context";
import { createTestConfigHelper } from "../../../__helpers__";

suite("Vue Composition Script Generator", () => {
	suite("Import Statement Generation", () => {
		test("should generate empty import when no features enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showComputedScriptOption": false,
					"option.showWatchScriptOption": false,
					"lifecycle.showLifecycleHooksScriptOptions": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("import {  } from 'vue'");
		});

		test("should include computed when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showComputedScriptOption": true,
					"option.showWatchScriptOption": false,
					"lifecycle.showLifecycleHooksScriptOptions": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("computed");
		});

		test("should include watch when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showComputedScriptOption": false,
					"option.showWatchScriptOption": true,
					"lifecycle.showLifecycleHooksScriptOptions": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("watch");
		});

		test("should include onMounted when lifecycle hooks enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"lifecycle.showLifecycleHooksScriptOptions": true,
					"lifecycle.showMountedScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("onMounted");
		});
	});

	suite("Define Options Generation", () => {
		test("should not include defineOptions when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"scriptSetup.showDefineOptions": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).not.to.include("defineOptions");
		});

		test("should include defineOptions when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"scriptSetup.showDefineOptions": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("defineOptions({");
			expect(result).to.include("inheritAttrs: true");
		});
	});

	suite("Define Model Generation", () => {
		test("should not include defineModel when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"scriptSetup.useDefineModel": false,
					"template.showV-ModelTemplate": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).not.to.include("defineModel");
		});

		test("should include defineModel with TypeScript when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"scriptSetup.useDefineModel": true,
					"template.showV-ModelTemplate": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("defineModel<string>");
		});

		test("should include defineModel without TypeScript types when JS", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"scriptSetup.useDefineModel": true,
					"template.showV-ModelTemplate": true,
				},
			});
			const ctx = createGeneratorContext(false, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("const model = defineModel({ default: '' })");
			expect(result).not.to.include("<string>");
		});
	});

	suite("Define Slots Generation", () => {
		test("should not include defineSlots when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"scriptSetup.showDefineSlots": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).not.to.include("defineSlots");
		});

		test("should include typed defineSlots when enabled with TypeScript", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"scriptSetup.showDefineSlots": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("defineSlots<{");
			expect(result).to.include("default(props: { msg: string }): any;");
		});

		test("should include simple defineSlots when JavaScript", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"scriptSetup.showDefineSlots": true,
				},
			});
			const ctx = createGeneratorContext(false, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("const slots = defineSlots();");
			expect(result).not.to.include("defineSlots<{");
		});
	});

	suite("Define Expose Generation", () => {
		test("should not include defineExpose when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"scriptSetup.showDefineExpose": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).not.to.include("defineExpose");
		});

		test("should include defineExpose when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"scriptSetup.showDefineExpose": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("defineExpose({");
		});
	});

	suite("Lifecycle Hooks", () => {
		test("should include all enabled lifecycle hooks", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"lifecycle.showLifecycleHooksScriptOptions": true,
					"lifecycle.showBeforeMountScriptOption": true,
					"lifecycle.showMountedScriptOption": true,
					"lifecycle.showBeforeUpdateScriptOption": true,
					"lifecycle.showUpdatedScriptOption": true,
					"lifecycle.showBeforeUnmountScriptOption": true,
					"lifecycle.showUnmountedScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("onBeforeMount");
			expect(result).to.include("onMounted");
			expect(result).to.include("onBeforeUpdate");
			expect(result).to.include("onUpdated");
			expect(result).to.include("onBeforeUnmount");
			expect(result).to.include("onUnmounted");
		});

		test("should not include lifecycle hooks when main toggle is off", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"lifecycle.showLifecycleHooksScriptOptions": false,
					"lifecycle.showMountedScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).not.to.include("onMounted");
		});
	});

	suite("Props Generation", () => {
		test("should not include props when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showPropsScriptOption": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).not.to.include("defineProps");
		});

		test("should include props when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showPropsScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("defineProps");
		});
	});

	suite("Emits Generation", () => {
		test("should not include emits when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showEmitsScriptOption": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).not.to.include("defineEmits");
		});

		test("should include emits when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showEmitsScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("defineEmits");
		});
	});

	suite("Computed Generation", () => {
		test("should not include computed when disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showComputedScriptOption": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			// Should not have computed in import or usage
			expect(result).not.to.match(/const \w+ = computed/);
		});

		test("should include computed when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showComputedScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("computed");
		});
	});

	suite("Watch Generation", () => {
		test("should include watch when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showWatchScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("watch");
		});
	});

	suite("Lifecycle Hooks Generation", () => {
		test("should include onBeforeMount when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"lifecycle.showLifecycleHooksScriptOptions": true,
					"lifecycle.showBeforeMountScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("onBeforeMount");
		});

		test("should include onBeforeUnmount when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"lifecycle.showLifecycleHooksScriptOptions": true,
					"lifecycle.showBeforeUnmountScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("onBeforeUnmount");
		});

		test("should include onUnmounted when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"lifecycle.showLifecycleHooksScriptOptions": true,
					"lifecycle.showUnmountedScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("onUnmounted");
		});

		test("should include multiple lifecycle hooks when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"lifecycle.showLifecycleHooksScriptOptions": true,
					"lifecycle.showMountedScriptOption": true,
					"lifecycle.showUnmountedScriptOption": true,
					"lifecycle.showBeforeMountScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("onMounted");
			expect(result).to.include("onUnmounted");
			expect(result).to.include("onBeforeMount");
		});

		test("should not include any lifecycle hooks when master toggle disabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"lifecycle.showLifecycleHooksScriptOptions": false,
					"lifecycle.showMountedScriptOption": true,
					"lifecycle.showUnmountedScriptOption": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).not.to.include("onMounted");
			expect(result).not.to.include("onUnmounted");
		});
	});

	suite("Combined Features", () => {
		test("should generate complete script with all features enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"scriptSetup.showDefineOptions": true,
					"scriptSetup.useDefineModel": true,
					"scriptSetup.showDefineSlots": true,
					"scriptSetup.showDefineExpose": true,
					"option.showPropsScriptOption": true,
					"option.showEmitsScriptOption": true,
					"option.showComputedScriptOption": true,
					"option.showWatchScriptOption": true,
					"option.showDataScriptOption": true,
					"lifecycle.showLifecycleHooksScriptOptions": true,
					"lifecycle.showMountedScriptOption": true,
					"template.showV-ModelTemplate": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("defineOptions");
			expect(result).to.include("defineProps");
			expect(result).to.include("defineEmits");
			expect(result).to.include("defineModel");
			expect(result).to.include("defineSlots");
			expect(result).to.include("defineExpose");
			expect(result).to.include("computed");
			expect(result).to.include("watch");
			expect(result).to.include("onMounted");
		});
	});

	suite("withDefaults Props", () => {
		test("should generate withDefaults for TypeScript when enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showPropsScriptOption": true,
					"scriptSetup.useWithDefaults": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("withDefaults");
			expect(result).to.include("defineProps<Props>");
			expect(result).to.include("interface Props");
		});

		test("should not generate withDefaults for JavaScript", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showPropsScriptOption": true,
					"scriptSetup.useWithDefaults": true,
				},
			});
			const ctx = createGeneratorContext(false, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).not.to.include("withDefaults");
			expect(result).to.include("defineProps");
		});

		test("should generate simple props when withDefaults enabled with defineModel", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showPropsScriptOption": true,
					"scriptSetup.useWithDefaults": true,
					"scriptSetup.useDefineModel": true,
					"template.showV-ModelTemplate": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("withDefaults");
			expect(result).to.include("text?: string");
		});
	});

	suite("V-Model Template Variations", () => {
		test("should generate computed v-model getter/setter when vmodel template enabled without defineModel", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showPropsScriptOption": true,
					"option.showEmitsScriptOption": true,
					"option.showComputedScriptOption": true,
					"template.showV-ModelTemplate": true,
					"scriptSetup.useDefineModel": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("modelValue");
			expect(result).to.include("update:modelValue");
		});

		test("should generate simple computed when vmodel not enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showComputedScriptOption": true,
					"template.showV-ModelTemplate": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("computed(() => Date.now())");
		});
	});

	suite("Emits Variations", () => {
		test("should generate simple emit when no vmodel and no props", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showEmitsScriptOption": true,
					"option.showPropsScriptOption": false,
					"template.showV-ModelTemplate": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("update:foo");
		});

		test("should generate update:text emit when props enabled but no vmodel", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showEmitsScriptOption": true,
					"option.showPropsScriptOption": true,
					"template.showV-ModelTemplate": false,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("update:text");
		});
	});

	suite("Watch Variations", () => {
		test("should watch model ref when defineModel is enabled with vmodel template", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showWatchScriptOption": true,
					"scriptSetup.useDefineModel": true,
					"template.showV-ModelTemplate": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("watch(");
			expect(result).to.include("model");
		});

		test("should watch props when defineModel is not enabled", () => {
			const configHelper = createTestConfigHelper({
				configOverrides: {
					"option.showWatchScriptOption": true,
					"option.showPropsScriptOption": true,
					"scriptSetup.useDefineModel": false,
					"template.showV-ModelTemplate": true,
				},
			});
			const ctx = createGeneratorContext(true, configHelper);

			const result = generateCompositionApiScriptTemplate(ctx);

			expect(result).to.include("watch(");
		});
	});
});
