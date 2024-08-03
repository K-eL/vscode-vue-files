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
		generateProps() +
		generateEmits() +
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
	if (_configHelper.showComputedScriptOption()) imports.push("computed");
	if (_configHelper.showWatchScriptOption()) imports.push("watch");
	if (_configHelper.showLifecycleHooksScriptOptions()) {
		if (_configHelper.showBeforeMountScriptOption())
			imports.push("onBeforeMount");
		if (_configHelper.showMountedScriptOption()) imports.push("onMounted");
		if (_configHelper.showBeforeUpdateScriptOption())
			imports.push("onBeforeUpdate");
		if (_configHelper.showUpdatedScriptOption()) imports.push("onUpdated");
		if (_configHelper.showActivatedScriptOption()) imports.push("onActivated");
		if (_configHelper.showDeactivatedScriptOption())
			imports.push("onDeactivated");
		if (_configHelper.showBeforeUnmountScriptOption())
			imports.push("onBeforeUnmount");
		if (_configHelper.showUnmountedScriptOption()) imports.push("onUnmounted");
		if (_configHelper.showErrorCapturedScriptOption())
			imports.push("onErrorCaptured");
		if (_configHelper.showRenderTrackedScriptOption())
			imports.push("onRenderTracked");
		if (_configHelper.showRenderTriggeredScriptOption())
			imports.push("onRenderTriggered");
	}
	return `import { ${imports.join(", ")} } from 'vue'` + `\n\n`;
};

const generateProps = (): string => {
	if (!_configHelper.showPropsScriptOption()) return "";
	return (
		`const props = defineProps({` +
		`\n` +
		generatePropsVModel() +
		`});` +
		`\n\n`
	);
};

const generatePropsVModel = (): string => {
	if (!_configHelper.showVModelTemplate()) return ind() + `text: String` + `\n`;
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
	if (!_configHelper.showEmitsScriptOption()) return "";
	return (
		`const emit = defineEmits({` + `\n` + generateEmitsVModel() + `});` + `\n\n`
	);
};

const generateEmitsVModel = (): string => {
	if (!_configHelper.showVModelTemplate()) {
		if (_configHelper.showPropsScriptOption())
			return (
				ind() +
				`'update:text': (value${_isTs ? ": any" : ""}) => value !== null,` +
				`\n`
			);
		return (
			ind() +
			`'update:foo': (value${_isTs ? ": any" : ""}) => value !== null,` +
			`\n`
		);
	}
	return (
		ind() +
		`// v-model event with validation` +
		`\n` +
		ind() +
		`'update:modelValue': (value${_isTs ? ": any" : ""}) => value !== null,` +
		`\n`
	);
};

const generateComputed = (): string => {
	if (!_configHelper.showComputedScriptOption()) return "";
	if (!_configHelper.showVModelTemplate())
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
		`set (value${_isTs ? ": any" : ""}) {` +
		`\n` +
		`${
			_configHelper.showEmitsScriptOption()
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
	if (!_configHelper.showWatchScriptOption()) return "";
	return (
		`const stopWatch = watch(` +
		`\n` +
		ind() +
		generateWatchVModel() +
		`, async (_newValue${_isTs ? ": any" : ""}, _oldValue${
			_isTs ? ": any" : ""
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

const generateWatchVModel = (): string => {
	if (!_configHelper.showVModelTemplate()) {
		if (!_configHelper.showPropsScriptOption()) return `() => new Date()`;
		return `() => props.text`;
	}
	return `() => props.modelValue`;
};

const generateBeforeMount = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showBeforeMountScriptOption()
	)
		return "";
	return `onBeforeMount(() => {` + `\n` + `});` + `\n\n`;
};

const generateMounted = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showMountedScriptOption()
	)
		return "";
	return `onMounted(() => {` + `\n` + `});` + `\n\n`;
};

const generateBeforeUpdate = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showBeforeUpdateScriptOption()
	)
		return "";
	return `onBeforeUpdate(() => {` + `\n` + `});` + `\n\n`;
};

const generateUpdated = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showUpdatedScriptOption()
	)
		return "";
	return `onUpdated(() => {` + `\n` + `});` + `\n\n`;
};

const generateActivated = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showActivatedScriptOption()
	)
		return "";
	return `onActivated(() => {` + `\n` + `});` + `\n\n`;
};

const generateDeactivated = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showDeactivatedScriptOption()
	)
		return "";
	return `onDeactivated(() => {` + `\n` + `});` + `\n\n`;
};

const generateBeforeUnmount = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showBeforeUnmountScriptOption()
	)
		return "";
	return (
		`onBeforeUnmount(() => {` +
		`\n` +
		`${
			_configHelper.showWatchScriptOption() ? ind() + `stopWatch();` + `\n` : ""
		}` +
		`});` +
		`\n\n`
	);
};

const generateUnmounted = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showUnmountedScriptOption()
	)
		return "";
	return `onUnmounted(() => {` + `\n` + `});` + `\n\n`;
};

const generateErrorCaptured = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showErrorCapturedScriptOption()
	)
		return "";
	return `onErrorCaptured(() => {` + `\n` + `});` + `\n\n`;
};

const generateRenderTracked = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showRenderTrackedScriptOption()
	)
		return "";
	return `onRenderTracked(() => {` + `\n` + `});` + `\n\n`;
};

const generateRenderTriggered = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showRenderTriggeredScriptOption()
	)
		return "";
	return `onRenderTriggered(() => {` + `\n` + `});` + `\n\n`;
};
