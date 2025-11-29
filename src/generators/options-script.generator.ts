/**
 * @fileoverview Generator for Vue 3 Options API script templates.
 * Generates traditional Options API component structures with defineComponent.
 *
 * @module generators/options-script
 */
import { GeneratorContext } from "../interfaces/generator-context";

/**
 * Generates the complete Options API script template content.
 * This includes the defineComponent wrapper with all configured options:
 * name, components, directives, props, emits, data, computed, watch,
 * lifecycle hooks, and methods.
 *
 * @param componentName - Name of the component
 * @param ctx - Generator context with config, isTs flag, and indentation
 * @returns Generated script content for an Options API component
 *
 * @example
 * ```typescript
 * const ctx = createGeneratorContext(true);
 * const script = generateOptionsApiScriptTemplate("MyComponent", ctx);
 * ```
 */
export const generateOptionsApiScriptTemplate = (
	componentName: string,
	ctx: GeneratorContext,
): string => {
	return (
		generateImportStatement() +
		`export default defineComponent({` +
		`\n` +
		generateName(componentName, ctx) +
		generateComponents(ctx) +
		generateDirectives(ctx) +
		generateExtends(ctx) +
		generateMixins(ctx) +
		generateProvideInject(ctx) +
		generateInheritAttrs(ctx) +
		generateProps(ctx) +
		generateEmits(ctx) +
		generateSetup(ctx) +
		generateData(ctx) +
		generateComputed(ctx) +
		generateWatch(ctx) +
		generateBeforeCreate(ctx) +
		generateCreated(ctx) +
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
		generateRenderTriggered(ctx) +
		generateMethods(ctx) +
		`});` +
		`\n`
	);
};

/**
 * Generates Vue import statement for Options API.
 */
const generateImportStatement = (): string => {
	const imports = ["defineComponent"];
	return `import { ${imports.join(", ")} } from 'vue'` + `\n\n`;
};

/**
 * Generates component name option.
 */
const generateName = (name: string, ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.options.showName()) return "";
	return ind() + `name: '${name}',` + `\n`;
};

/**
 * Generates components option.
 */
const generateComponents = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.options.showComponents()) return "";
	return ind() + `components: {` + `\n` + ind() + `},` + `\n`;
};

/**
 * Generates directives option.
 */
const generateDirectives = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.options.showDirectives()) return "";
	return ind() + `directives: {` + `\n` + ind() + `},` + `\n`;
};

/**
 * Generates extends option.
 */
const generateExtends = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.options.showExtends()) return "";
	return ind() + `extends: {` + `\n` + ind() + `},` + `\n`;
};

/**
 * Generates mixins option.
 */
const generateMixins = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.options.showMixins()) return "";
	return ind() + `mixins: [` + `\n` + ind() + `],` + `\n`;
};

/**
 * Generates provide/inject options.
 */
const generateProvideInject = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.options.showProvideInject()) return "";
	return (
		ind() +
		`provide: {` +
		`\n` +
		ind() +
		`},` +
		`\n` +
		ind() +
		`inject: {` +
		`\n` +
		ind() +
		`},` +
		`\n`
	);
};

/**
 * Generates inheritAttrs option.
 */
const generateInheritAttrs = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.options.showInheritAttrs()) return "";
	return ind() + `inheritAttrs: false,` + `\n`;
};

/**
 * Generates props option.
 */
const generateProps = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.options.showProps()) return "";
	return (
		ind() + `props: {` + `\n` + generatePropsVModel(ctx) + ind() + `},` + `\n`
	);
};

/**
 * Generates v-model prop definition for Options API.
 */
const generatePropsVModel = (ctx: GeneratorContext): string => {
	const { config, isTs, ind } = ctx;
	if (!config.showVModelTemplate()) return "";
	return (
		ind(2) +
		`// v-model` +
		`\n` +
		ind(2) +
		`modelValue: {` +
		`\n` +
		`${isTs ? ind(3) + "type: String, " + "\n" : ""}` +
		ind(3) +
		`default: '',` +
		`\n` +
		ind(2) +
		`},` +
		`\n`
	);
};

/**
 * Generates emits option.
 */
const generateEmits = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.options.showEmits()) return "";
	return (
		ind() + `emits: {` + `\n` + generateEmitsVModel(ctx) + ind() + `},` + `\n`
	);
};

/**
 * Generates v-model emit definition for Options API.
 */
const generateEmitsVModel = (ctx: GeneratorContext): string => {
	const { config, isTs, ind } = ctx;
	if (!config.showVModelTemplate()) return "";
	return (
		ind(2) +
		`// v-model event with validation` +
		`\n` +
		ind(2) +
		`'update:modelValue': (value${isTs ? ": any" : ""}) => value !== null,` +
		`\n`
	);
};

/**
 * Generates setup option.
 */
const generateSetup = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.options.showSetup()) return "";
	return ind() + `setup() {` + `\n` + ind() + `},` + `\n`;
};

/**
 * Generates data option.
 */
const generateData = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.options.showData()) return "";
	return (
		ind() +
		`data() {` +
		`\n` +
		ind(2) +
		`return {` +
		`\n` +
		ind(2) +
		`};` +
		`\n` +
		ind() +
		`},` +
		`\n`
	);
};

/**
 * Generates computed option.
 */
const generateComputed = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.options.showComputed()) return "";
	return (
		ind() +
		`computed: {` +
		`\n` +
		generateComputedVModel(ctx) +
		ind() +
		`},` +
		`\n`
	);
};

/**
 * Generates v-model computed getter/setter for Options API.
 */
const generateComputedVModel = (ctx: GeneratorContext): string => {
	const { config, isTs, ind } = ctx;
	if (!config.showVModelTemplate()) return "";
	return (
		ind(2) +
		`value: {` +
		`\n` +
		ind(3) +
		`get () {` +
		`\n` +
		ind(4) +
		`return this.modelValue;` +
		`\n` +
		ind(3) +
		`},` +
		`\n` +
		ind(3) +
		`set (value${isTs ? ": any" : ""}) {` +
		`\n` +
		`${
			config.options.showEmits()
				? ind(4) + `this.$emit('update:modelValue', value);` + `\n`
				: ""
		}` +
		ind(3) +
		`},` +
		`\n` +
		ind(2) +
		`},` +
		`\n`
	);
};

/**
 * Generates watch option.
 */
const generateWatch = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.options.showWatch()) return "";
	return (
		ind() + `watch: {` + `\n` + generateWatchVModel(ctx) + ind() + `},` + `\n`
	);
};

/**
 * Generates v-model watcher for Options API.
 */
const generateWatchVModel = (ctx: GeneratorContext): string => {
	const { config, isTs, ind } = ctx;
	if (!config.showVModelTemplate()) return "";
	return (
		ind(2) +
		`modelValue: {` +
		`\n` +
		ind(3) +
		`async handler (_newValue${isTs ? ": any" : ""}, _oldValue${
			isTs ? ": any" : ""
		}) {` +
		`\n` +
		ind(4) +
		`// do something` +
		`\n` +
		ind(3) +
		`},` +
		`\n` +
		ind(3) +
		`immediate: true` +
		`\n` +
		ind(2) +
		`},` +
		`\n`
	);
};

// ============================================================================
// Lifecycle Hooks
// ============================================================================

/**
 * Generates beforeCreate lifecycle hook.
 */
const generateBeforeCreate = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showBeforeCreate())
		return "";
	return ind() + `beforeCreate() {` + `\n` + ind() + `},` + `\n`;
};

/**
 * Generates created lifecycle hook.
 */
const generateCreated = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showCreated())
		return "";
	return ind() + `created() {` + `\n` + ind() + `},` + `\n`;
};

/**
 * Generates beforeMount lifecycle hook.
 */
const generateBeforeMount = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showBeforeMount())
		return "";
	return ind() + `beforeMount() {` + `\n` + ind() + `},` + `\n`;
};

/**
 * Generates mounted lifecycle hook.
 */
const generateMounted = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showMounted())
		return "";
	return ind() + `mounted() {` + `\n` + ind() + `},` + `\n`;
};

/**
 * Generates beforeUpdate lifecycle hook.
 */
const generateBeforeUpdate = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showBeforeUpdate())
		return "";
	return ind() + `beforeUpdate() {` + `\n` + ind() + `},` + `\n`;
};

/**
 * Generates updated lifecycle hook.
 */
const generateUpdated = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showUpdated())
		return "";
	return ind() + `updated() {` + `\n` + ind() + `},` + `\n`;
};

/**
 * Generates activated lifecycle hook.
 */
const generateActivated = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showActivated())
		return "";
	return ind() + `activated() {` + `\n` + ind() + `},` + `\n`;
};

/**
 * Generates deactivated lifecycle hook.
 */
const generateDeactivated = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showDeactivated())
		return "";
	return ind() + `deactivated() {` + `\n` + ind() + `},` + `\n`;
};

/**
 * Generates beforeUnmount lifecycle hook.
 */
const generateBeforeUnmount = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showBeforeUnmount())
		return "";
	return (
		ind() +
		`beforeUnmount() {` +
		`\n` +
		generateBeforeUnmountVModel(ctx) +
		ind() +
		`},` +
		`\n`
	);
};

/**
 * Generates beforeUnmount cleanup code for v-model watcher.
 */
const generateBeforeUnmountVModel = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.showVModelTemplate() || !config.options.showWatch()) return "";
	return (
		ind(2) +
		`// stop the wacher on modelValue` +
		`\n` +
		ind(2) +
		`this.$watch('modelValue', () => {}, {});` +
		`\n`
	);
};

/**
 * Generates unmounted lifecycle hook.
 */
const generateUnmounted = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.lifecycle.showHooks() || !config.lifecycle.showUnmounted())
		return "";
	return ind() + `unmounted() {` + `\n` + ind() + `},` + `\n`;
};

/**
 * Generates errorCaptured lifecycle hook.
 */
const generateErrorCaptured = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.lifecycle.showErrorCaptured()) return "";
	return ind() + `errorCaptured() {` + `\n` + ind() + `},` + `\n`;
};

/**
 * Generates renderTracked lifecycle hook.
 */
const generateRenderTracked = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.lifecycle.showRenderTracked()) return "";
	return ind() + `renderTracked() {` + `\n` + ind() + `},` + `\n`;
};

/**
 * Generates renderTriggered lifecycle hook.
 */
const generateRenderTriggered = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.lifecycle.showRenderTriggered()) return "";
	return ind() + `renderTriggered() {` + `\n` + ind() + `},` + `\n`;
};

/**
 * Generates methods option.
 */
const generateMethods = (ctx: GeneratorContext): string => {
	const { config, ind } = ctx;
	if (!config.options.showMethods()) return "";
	return ind() + `methods: {` + `\n` + ind() + `},` + `\n`;
};
