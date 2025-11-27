import { ConfigHelper } from "../helpers/config.helper";

let _isTs: boolean = false;
let _configHelper = new ConfigHelper();
let ind: (x?: number) => string;

export const generateCompositionApiScriptTemplate = (
	isTs: boolean,
	configHelper: ConfigHelper,
) => {
	_isTs = isTs;
	_configHelper = configHelper;
	ind = _configHelper.ind;
	return (
		generateImportStatement() +
		generateDefineOptions() +
		generateDefineModel() +
		generateProps() +
		generateEmits() +
		generateDefineSlots() +
		generateDefineExpose() +
		generateComputed() +
		generateWatch() +
		generateBeforeMount() +
		generateMounted() +
		generateBeforeUpdate() +
		generateUpdated() +
		generateActivated() +
		generateDeactivated() +
		generateBeforeUnmount() +
		generateUnmounted() +
		generateErrorCaptured() +
		generateRenderTracked() +
		generateRenderTriggered()
	);
};

const generateImportStatement = (): string => {
	const imports = [];
	if (_configHelper.options.showComputed()) imports.push("computed");
	if (_configHelper.options.showWatch()) imports.push("watch");
	if (_configHelper.lifecycle.showHooks()) {
		if (_configHelper.lifecycle.showBeforeMount())
			imports.push("onBeforeMount");
		if (_configHelper.lifecycle.showMounted()) imports.push("onMounted");
		if (_configHelper.lifecycle.showBeforeUpdate())
			imports.push("onBeforeUpdate");
		if (_configHelper.lifecycle.showUpdated()) imports.push("onUpdated");
		if (_configHelper.lifecycle.showActivated()) imports.push("onActivated");
		if (_configHelper.lifecycle.showDeactivated())
			imports.push("onDeactivated");
		if (_configHelper.lifecycle.showBeforeUnmount())
			imports.push("onBeforeUnmount");
		if (_configHelper.lifecycle.showUnmounted()) imports.push("onUnmounted");
		if (_configHelper.lifecycle.showErrorCaptured())
			imports.push("onErrorCaptured");
		if (_configHelper.lifecycle.showRenderTracked())
			imports.push("onRenderTracked");
		if (_configHelper.lifecycle.showRenderTriggered())
			imports.push("onRenderTriggered");
	}
	return `import { ${imports.join(", ")} } from 'vue'` + `\n\n`;
};

/**
 * Generates defineOptions macro (Vue 3.3+)
 * Used for inheritAttrs, name, and other component options
 */
const generateDefineOptions = (): string => {
	if (!_configHelper.scriptSetup.showDefineOptions()) return "";
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
 * Generates defineModel macro (Vue 3.4+)
 * Modern approach for v-model bindings
 */
const generateDefineModel = (): string => {
	// Only generate if using defineModel AND v-model template is enabled
	if (!_configHelper.scriptSetup.useDefineModel() || !_configHelper.showVModelTemplate()) {
		return "";
	}
	
	if (_isTs) {
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
 * Generates defineSlots macro (Vue 3.3+)
 * For typed slot definitions
 */
const generateDefineSlots = (): string => {
	if (!_configHelper.scriptSetup.showDefineSlots()) return "";
	
	if (_isTs) {
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
	
	return (
		`// Slots (Vue 3.3+)` +
		`\n` +
		`const slots = defineSlots();` +
		`\n\n`
	);
};

/**
 * Generates defineExpose macro
 * Exposes component internals to parent via template ref
 */
const generateDefineExpose = (): string => {
	if (!_configHelper.scriptSetup.showDefineExpose()) return "";
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

const generateProps = (): string => {
	if (!_configHelper.options.showProps()) return "";
	
	// If using defineModel for v-model, skip the modelValue prop
	const useDefineModelForVModel = _configHelper.scriptSetup.useDefineModel() && _configHelper.showVModelTemplate();
	
	if (_configHelper.scriptSetup.useWithDefaults() && _isTs) {
		return generatePropsWithDefaults(useDefineModelForVModel);
	}
	
	return (
		`const props = defineProps({` +
		`\n` +
		generatePropsVModel(useDefineModelForVModel) +
		`});` +
		`\n\n`
	);
};

/**
 * Generates props using withDefaults for TypeScript
 */
const generatePropsWithDefaults = (skipModelValue: boolean): string => {
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

const generatePropsVModel = (skipModelValue: boolean = false): string => {
	// If using defineModel, show simple text prop instead of modelValue
	if (skipModelValue || !_configHelper.showVModelTemplate()) {
		return ind() + `text: String` + `\n`;
	}
	
	return (
		ind() +
		`// v-model` +
		`\n` +
		ind() +
		`modelValue: {` +
		`\n` +
		`${_isTs ? ind(2) + "type: String, " + "\n" : ""}` +
		ind(2) +
		`default: '',` +
		`\n` +
		ind() +
		`},` +
		`\n`
	);
};

const generateEmits = (): string => {
	if (!_configHelper.options.showEmits()) return "";
	
	// If using defineModel for v-model, skip the update:modelValue emit
	const useDefineModelForVModel = _configHelper.scriptSetup.useDefineModel() && _configHelper.showVModelTemplate();
	
	return (
		`const emit = defineEmits({` + `\n` + generateEmitsVModel(useDefineModelForVModel) + `});` + `\n\n`
	);
};

const generateEmitsVModel = (skipModelValue: boolean = false): string => {
	// If using defineModel, show simple text update emit instead
	if (skipModelValue) {
		return (
			ind() +
			`'update:text': (value${_isTs ? ": string" : ""}) => typeof value === 'string',` +
			`\n`
		);
	}
	
	if (!_configHelper.showVModelTemplate()) {
		if (_configHelper.options.showProps())
			return (
				ind() +
				`'update:text': (value${_isTs ? ": string" : ""}) => typeof value === 'string',` +
				`\n`
			);
		return (
			ind() +
			`'update:foo': (value${_isTs ? ": unknown" : ""}) => value !== null,` +
			`\n`
		);
	}
	return (
		ind() +
		`// v-model event with validation` +
		`\n` +
		ind() +
		`'update:modelValue': (value${_isTs ? ": string" : ""}) => typeof value === 'string',` +
		`\n`
	);
};

const generateComputed = (): string => {
	if (!_configHelper.options.showComputed()) return "";
	
	// If using defineModel, show simple computed example
	const useDefineModelForVModel = _configHelper.scriptSetup.useDefineModel() && _configHelper.showVModelTemplate();
	
	if (!_configHelper.showVModelTemplate() || useDefineModelForVModel)
		return `const now = computed(() => Date.now());` + `\n\n`;
	return `const value = computed(` + generateComputedVModel() + `);` + `\n\n`;
};

const generateComputedVModel = (): string => {
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
		`set (value${_isTs ? ": string" : ""}) {` +
		`\n` +
		`${
			_configHelper.options.showEmits()
				? ind(2) + `emit('update:modelValue', value);` + `\n`
				: ""
		}` +
		ind() +
		`},` +
		`\n` +
		`}`
	);
};

const generateWatch = (): string => {
	if (!_configHelper.options.showWatch()) return "";
	
	// If using defineModel, watch the model ref directly
	const useDefineModelForVModel = _configHelper.scriptSetup.useDefineModel() && _configHelper.showVModelTemplate();
	
	return (
		`const stopWatch = watch(` +
		`\n` +
		ind() +
		generateWatchVModel(useDefineModelForVModel) +
		`, async (_newValue${_isTs ? ": string | undefined" : ""}, _oldValue${
			_isTs ? ": string | undefined" : ""
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

const generateWatchVModel = (useDefineModel: boolean = false): string => {
	// If using defineModel, watch the model ref
	if (useDefineModel) {
		return `model`;
	}
	if (!_configHelper.showVModelTemplate()) {
		if (!_configHelper.options.showProps()) return `() => new Date()`;
		return `() => props.text`;
	}
	return `() => props.modelValue`;
};

const generateBeforeMount = (): string => {
	if (
		!_configHelper.lifecycle.showHooks() ||
		!_configHelper.lifecycle.showBeforeMount()
	)
		return "";
	return `onBeforeMount(() => {` + `\n` + `});` + `\n\n`;
};

const generateMounted = (): string => {
	if (
		!_configHelper.lifecycle.showHooks() ||
		!_configHelper.lifecycle.showMounted()
	)
		return "";
	return `onMounted(() => {` + `\n` + `});` + `\n\n`;
};

const generateBeforeUpdate = (): string => {
	if (
		!_configHelper.lifecycle.showHooks() ||
		!_configHelper.lifecycle.showBeforeUpdate()
	)
		return "";
	return `onBeforeUpdate(() => {` + `\n` + `});` + `\n\n`;
};

const generateUpdated = (): string => {
	if (
		!_configHelper.lifecycle.showHooks() ||
		!_configHelper.lifecycle.showUpdated()
	)
		return "";
	return `onUpdated(() => {` + `\n` + `});` + `\n\n`;
};

const generateActivated = (): string => {
	if (
		!_configHelper.lifecycle.showHooks() ||
		!_configHelper.lifecycle.showActivated()
	)
		return "";
	return `onActivated(() => {` + `\n` + `});` + `\n\n`;
};

const generateDeactivated = (): string => {
	if (
		!_configHelper.lifecycle.showHooks() ||
		!_configHelper.lifecycle.showDeactivated()
	)
		return "";
	return `onDeactivated(() => {` + `\n` + `});` + `\n\n`;
};

const generateBeforeUnmount = (): string => {
	if (
		!_configHelper.lifecycle.showHooks() ||
		!_configHelper.lifecycle.showBeforeUnmount()
	)
		return "";
	return (
		`onBeforeUnmount(() => {` +
		`\n` +
		`${
			_configHelper.options.showWatch() ? ind() + `stopWatch();` + `\n` : ""
		}` +
		`});` +
		`\n\n`
	);
};

const generateUnmounted = (): string => {
	if (
		!_configHelper.lifecycle.showHooks() ||
		!_configHelper.lifecycle.showUnmounted()
	)
		return "";
	return `onUnmounted(() => {` + `\n` + `});` + `\n\n`;
};

const generateErrorCaptured = (): string => {
	if (
		!_configHelper.lifecycle.showHooks() ||
		!_configHelper.lifecycle.showErrorCaptured()
	)
		return "";
	return `onErrorCaptured(() => {` + `\n` + `});` + `\n\n`;
};

const generateRenderTracked = (): string => {
	if (
		!_configHelper.lifecycle.showHooks() ||
		!_configHelper.lifecycle.showRenderTracked()
	)
		return "";
	return `onRenderTracked(() => {` + `\n` + `});` + `\n\n`;
};

const generateRenderTriggered = (): string => {
	if (
		!_configHelper.lifecycle.showHooks() ||
		!_configHelper.lifecycle.showRenderTriggered()
	)
		return "";
	return `onRenderTriggered(() => {` + `\n` + `});` + `\n\n`;
};
