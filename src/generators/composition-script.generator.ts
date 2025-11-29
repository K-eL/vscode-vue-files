/**
 * @fileoverview Generator for Vue 3 Composition API script templates.
 * Generates script setup blocks with modern Vue 3 macros and patterns.
 *
 * @module generators/composition-script
 */
import { GeneratorContext } from "../interfaces/generator-context";

/**
 * Generates the complete Composition API script template content.
 * This includes imports, macros (defineOptions, defineModel, etc.),
 * props, emits, computed, watch, and lifecycle hooks.
 *
 * @param ctx - Generator context with config, isTs flag, and indentation
 * @returns Generated script content for a script setup block
 *
 * @example
 * ```typescript
 * const ctx = createGeneratorContext(true);
 * const script = generateCompositionApiScriptTemplate(ctx);
 * ```
 */
export const generateCompositionApiScriptTemplate = (
	ctx: GeneratorContext,
): string => {
	return (
		generateImportStatement(ctx) +
		generateDefineOptions(ctx) +
		generateDefineModel(ctx) +
		generateProps(ctx) +
		generateEmits(ctx) +
		generateDefineSlots(ctx) +
		generateDefineExpose(ctx) +
		generateComputed(ctx) +
		generateWatch(ctx) +
		generateBeforeMount(ctx) +
		generateMounted(ctx) +
		generateBeforeUpdate(ctx) +
		generateUpdated(ctx) +
		generateActivated(ctx) +
		generateDeactivated(ctx) +
		generateBeforeUnmount(ctx) +
		generateUnmounted(ctx) +
		generateErrorCaptured(ctx) +
		generateRenderTracked(ctx) +
		generateRenderTriggered(ctx)
	);
};

/**
 * Generates Vue import statement based on enabled features.
 */
const generateImportStatement = (ctx: GeneratorContext): string => {
	const { config } = ctx;
	const imports: string[] = [];

	if (config.options.showComputed()) imports.push("computed");
	if (config.options.showWatch()) imports.push("watch");

	if (config.lifecycle.showHooks()) {
		if (config.lifecycle.showBeforeMount()) imports.push("onBeforeMount");
		if (config.lifecycle.showMounted()) imports.push("onMounted");
		if (config.lifecycle.showBeforeUpdate()) imports.push("onBeforeUpdate");
		if (config.lifecycle.showUpdated()) imports.push("onUpdated");
		if (config.lifecycle.showActivated()) imports.push("onActivated");
		if (config.lifecycle.showDeactivated()) imports.push("onDeactivated");
		if (config.lifecycle.showBeforeUnmount()) imports.push("onBeforeUnmount");
		if (config.lifecycle.showUnmounted()) imports.push("onUnmounted");
		if (config.lifecycle.showErrorCaptured()) imports.push("onErrorCaptured");
		if (config.lifecycle.showRenderTracked()) imports.push("onRenderTracked");
		if (config.lifecycle.showRenderTriggered())
			imports.push("onRenderTriggered");
	}

	return `import { ${imports.join(", ")} } from 'vue'` + `\n\n`;
};

/**
 * Generates defineOptions macro (Vue 3.3+).
 * Used for inheritAttrs, name, and other component options.
 */
const generateDefineOptions = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.scriptSetup.showDefineOptions()) return "";

	return (
		`// Component options (Vue 3.3+)` +
		`\n` +
		`defineOptions({` +
		`\n` +
		ind() +
		`inheritAttrs: true,` +
		`\n` +
		ind() +
		`// name: 'ComponentName',` +
		`\n` +
		`});` +
		`\n\n`
	);
};

/**
 * Generates defineModel macro (Vue 3.4+).
 * Modern approach for v-model bindings.
 */
const generateDefineModel = (ctx: GeneratorContext): string => {
	const { config, isTs } = ctx;

	// Only generate if using defineModel AND v-model template is enabled
	if (!config.scriptSetup.useDefineModel() || !config.showVModelTemplate()) {
		return "";
	}

	if (isTs) {
		return (
			`// v-model binding (Vue 3.4+)` +
			`\n` +
			`const model = defineModel<string>({ default: '' });` +
			`\n\n`
		);
	}

	return (
		`// v-model binding (Vue 3.4+)` +
		`\n` +
		`const model = defineModel({ default: '' });` +
		`\n\n`
	);
};

/**
 * Generates defineSlots macro (Vue 3.3+).
 * For typed slot definitions.
 */
const generateDefineSlots = (ctx: GeneratorContext): string => {
	const { config, isTs, ind } = ctx;
	if (!config.scriptSetup.showDefineSlots()) return "";

	if (isTs) {
		return (
			`// Typed slots (Vue 3.3+)` +
			`\n` +
			`const slots = defineSlots<{` +
			`\n` +
			ind() +
			`default(props: { msg: string }): any;` +
			`\n` +
			ind() +
			`// Add more slot definitions here` +
			`\n` +
			`}>();` +
			`\n\n`
		);
	}

	return `// Slots (Vue 3.3+)` + `\n` + `const slots = defineSlots();` + `\n\n`;
};

/**
 * Generates defineExpose macro.
 * Exposes component internals to parent via template ref.
 */
const generateDefineExpose = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.scriptSetup.showDefineExpose()) return "";

	return (
		`// Expose to parent component via template ref` +
		`\n` +
		`defineExpose({` +
		`\n` +
		ind() +
		`// Add methods/properties to expose here` +
		`\n` +
		`});` +
		`\n\n`
	);
};

/**
 * Generates props definition using defineProps.
 */
const generateProps = (ctx: GeneratorContext): string => {
	const { config, isTs } = ctx;
	if (!config.options.showProps()) return "";

	// If using defineModel for v-model, skip the modelValue prop
	const useDefineModelForVModel =
		config.scriptSetup.useDefineModel() && config.showVModelTemplate();

	if (config.scriptSetup.useWithDefaults() && isTs) {
		return generatePropsWithDefaults(ctx, useDefineModelForVModel);
	}

	return (
		`const props = defineProps({` +
		`\n` +
		generatePropsVModel(ctx, useDefineModelForVModel) +
		`});` +
		`\n\n`
	);
};

/**
 * Generates props using withDefaults for TypeScript.
 */
const generatePropsWithDefaults = (
	ctx: GeneratorContext,
	skipModelValue: boolean,
): string => {
	const { ind } = ctx;

	if (skipModelValue) {
		// When using defineModel, show a simple prop example
		return (
			`// Props with defaults (TypeScript)` +
			`\n` +
			`interface Props {` +
			`\n` +
			ind() +
			`text?: string;` +
			`\n` +
			ind() +
			`count?: number;` +
			`\n` +
			`}` +
			`\n\n` +
			`const props = withDefaults(defineProps<Props>(), {` +
			`\n` +
			ind() +
			`text: '',` +
			`\n` +
			ind() +
			`count: 0,` +
			`\n` +
			`});` +
			`\n\n`
		);
	}

	// Legacy v-model approach with withDefaults
	return (
		`// Props with defaults (TypeScript)` +
		`\n` +
		`interface Props {` +
		`\n` +
		ind() +
		`modelValue?: string;` +
		`\n` +
		`}` +
		`\n\n` +
		`const props = withDefaults(defineProps<Props>(), {` +
		`\n` +
		ind() +
		`modelValue: '',` +
		`\n` +
		`});` +
		`\n\n`
	);
};

/**
 * Generates v-model prop definition.
 */
const generatePropsVModel = (
	ctx: GeneratorContext,
	skipModelValue: boolean = false,
): string => {
	const { config, isTs, ind } = ctx;

	// If using defineModel, show simple text prop instead of modelValue
	if (skipModelValue || !config.showVModelTemplate()) {
		return ind() + `text: String` + `\n`;
	}

	return (
		ind() +
		`// v-model` +
		`\n` +
		ind() +
		`modelValue: {` +
		`\n` +
		`${isTs ? ind(2) + "type: String, " + "\n" : ""}` +
		ind(2) +
		`default: '',` +
		`\n` +
		ind() +
		`},` +
		`\n`
	);
};

/**
 * Generates emits definition using defineEmits.
 */
const generateEmits = (ctx: GeneratorContext): string => {
	const { config } = ctx;
	if (!config.options.showEmits()) return "";

	// If using defineModel for v-model, skip the update:modelValue emit
	const useDefineModelForVModel =
		config.scriptSetup.useDefineModel() && config.showVModelTemplate();

	return (
		`const emit = defineEmits({` +
		`\n` +
		generateEmitsVModel(ctx, useDefineModelForVModel) +
		`});` +
		`\n\n`
	);
};

/**
 * Generates v-model emit definition.
 */
const generateEmitsVModel = (
	ctx: GeneratorContext,
	skipModelValue: boolean = false,
): string => {
	const { config, isTs, ind } = ctx;

	// If using defineModel, show simple text update emit instead
	if (skipModelValue) {
		return (
			ind() +
			`'update:text': (value${isTs ? ": string" : ""}) => typeof value === 'string',` +
			`\n`
		);
	}

	if (!config.showVModelTemplate()) {
		if (config.options.showProps())
			return (
				ind() +
				`'update:text': (value${isTs ? ": string" : ""}) => typeof value === 'string',` +
				`\n`
			);
		return (
			ind() +
			`'update:foo': (value${isTs ? ": unknown" : ""}) => value !== null,` +
			`\n`
		);
	}

	return (
		ind() +
		`// v-model event with validation` +
		`\n` +
		ind() +
		`'update:modelValue': (value${isTs ? ": string" : ""}) => typeof value === 'string',` +
		`\n`
	);
};

/**
 * Generates computed property definition.
 */
const generateComputed = (ctx: GeneratorContext): string => {
	const { config } = ctx;
	if (!config.options.showComputed()) return "";

	// If using defineModel, show simple computed example
	const useDefineModelForVModel =
		config.scriptSetup.useDefineModel() && config.showVModelTemplate();

	if (!config.showVModelTemplate() || useDefineModelForVModel)
		return `const now = computed(() => Date.now());` + `\n\n`;

	return `const value = computed(` + generateComputedVModel(ctx) + `);` + `\n\n`;
};

/**
 * Generates v-model computed getter/setter.
 */
const generateComputedVModel = (ctx: GeneratorContext): string => {
	const { config, isTs, ind } = ctx;

	return (
		`{` +
		`\n` +
		ind() +
		`get () {` +
		`\n` +
		ind(2) +
		`return props.modelValue;` +
		`\n` +
		ind() +
		`},` +
		`\n` +
		ind() +
		`set (value${isTs ? ": string" : ""}) {` +
		`\n` +
		`${
			config.options.showEmits()
				? ind(2) + `emit('update:modelValue', value);` + `\n`
				: ""
		}` +
		ind() +
		`},` +
		`\n` +
		`}`
	);
};

/**
 * Generates watch definition.
 */
const generateWatch = (ctx: GeneratorContext): string => {
	const { config, isTs, ind } = ctx;
	if (!config.options.showWatch()) return "";

	// If using defineModel, watch the model ref directly
	const useDefineModelForVModel =
		config.scriptSetup.useDefineModel() && config.showVModelTemplate();

	return (
		`const stopWatch = watch(` +
		`\n` +
		ind() +
		generateWatchVModel(ctx, useDefineModelForVModel) +
		`, async (_newValue${isTs ? ": string | undefined" : ""}, _oldValue${
			isTs ? ": string | undefined" : ""
		}) => {` +
		`\n` +
		ind(2) +
		`// do something` +
		`\n` +
		ind() +
		`},` +
		`\n` +
		ind() +
		`{` +
		`\n` +
		ind(2) +
		`immediate: true` +
		`\n` +
		ind() +
		`}` +
		`\n` +
		`);` +
		`\n\n`
	);
};

/**
 * Generates watch source for v-model.
 */
const generateWatchVModel = (
	ctx: GeneratorContext,
	useDefineModel: boolean = false,
): string => {
	const { config } = ctx;

	// If using defineModel, watch the model ref
	if (useDefineModel) {
		return `model`;
	}
	if (!config.showVModelTemplate()) {
		if (!config.options.showProps()) return `() => new Date()`;
		return `() => props.text`;
	}
	return `() => props.modelValue`;
};

// ============================================================================
// Lifecycle Hooks
// ============================================================================

/**
 * Generates onBeforeMount lifecycle hook.
 */
const generateBeforeMount = (ctx: GeneratorContext): string => {
	const { config } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showBeforeMount())
		return "";
	return `onBeforeMount(() => {` + `\n` + `});` + `\n\n`;
};

/**
 * Generates onMounted lifecycle hook.
 */
const generateMounted = (ctx: GeneratorContext): string => {
	const { config } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showMounted())
		return "";
	return `onMounted(() => {` + `\n` + `});` + `\n\n`;
};

/**
 * Generates onBeforeUpdate lifecycle hook.
 */
const generateBeforeUpdate = (ctx: GeneratorContext): string => {
	const { config } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showBeforeUpdate())
		return "";
	return `onBeforeUpdate(() => {` + `\n` + `});` + `\n\n`;
};

/**
 * Generates onUpdated lifecycle hook.
 */
const generateUpdated = (ctx: GeneratorContext): string => {
	const { config } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showUpdated())
		return "";
	return `onUpdated(() => {` + `\n` + `});` + `\n\n`;
};

/**
 * Generates onActivated lifecycle hook.
 */
const generateActivated = (ctx: GeneratorContext): string => {
	const { config } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showActivated())
		return "";
	return `onActivated(() => {` + `\n` + `});` + `\n\n`;
};

/**
 * Generates onDeactivated lifecycle hook.
 */
const generateDeactivated = (ctx: GeneratorContext): string => {
	const { config } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showDeactivated())
		return "";
	return `onDeactivated(() => {` + `\n` + `});` + `\n\n`;
};

/**
 * Generates onBeforeUnmount lifecycle hook.
 */
const generateBeforeUnmount = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showBeforeUnmount())
		return "";
	return (
		`onBeforeUnmount(() => {` +
		`\n` +
		`${config.options.showWatch() ? ind() + `stopWatch();` + `\n` : ""}` +
		`});` +
		`\n\n`
	);
};

/**
 * Generates onUnmounted lifecycle hook.
 */
const generateUnmounted = (ctx: GeneratorContext): string => {
	const { config } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showUnmounted())
		return "";
	return `onUnmounted(() => {` + `\n` + `});` + `\n\n`;
};

/**
 * Generates onErrorCaptured lifecycle hook.
 */
const generateErrorCaptured = (ctx: GeneratorContext): string => {
	const { config } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showErrorCaptured())
		return "";
	return `onErrorCaptured(() => {` + `\n` + `});` + `\n\n`;
};

/**
 * Generates onRenderTracked lifecycle hook.
 */
const generateRenderTracked = (ctx: GeneratorContext): string => {
	const { config } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showRenderTracked())
		return "";
	return `onRenderTracked(() => {` + `\n` + `});` + `\n\n`;
};

/**
 * Generates onRenderTriggered lifecycle hook.
 */
const generateRenderTriggered = (ctx: GeneratorContext): string => {
	const { config } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showRenderTriggered())
		return "";
	return `onRenderTriggered(() => {` + `\n` + `});` + `\n\n`;
};
