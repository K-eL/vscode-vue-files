import {
	showActivatedScriptOption,
	showBeforeMountScriptOption,
	showBeforeUnmountScriptOption,
	showBeforeUpdateScriptOption,
	showComputedScriptOption,
	showDeactivatedScriptOption,
	showEmitsScriptOption,
	showErrorCapturedScriptOption,
	showLifecycleHooksScriptOptions,
	showMountedScriptOption,
	showPropsScriptOption,
	showRenderTrackedScriptOption,
	showRenderTriggeredScriptOption,
	showUnmountedScriptOption,
	showUpdatedScriptOption,
	showVModelTemplate,
	showWatchScriptOption
} from "../helpers/config.helper";

let _isTs: boolean = false;

export const generateCompositionApiScriptTemplate = (isTs: boolean) => {
	_isTs = isTs;
	return generateImportStatement() +
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
		generateRenderTriggered();
};

const generateImportStatement = (): string => {
	const imports = [];
	if (showComputedScriptOption()) imports.push('computed');
	if (showWatchScriptOption()) imports.push('watch');
	if (showLifecycleHooksScriptOptions()) {
		if (showBeforeMountScriptOption()) imports.push('onBeforeMount');
		if (showMountedScriptOption()) imports.push('onMounted');
		if (showBeforeUpdateScriptOption()) imports.push('onBeforeUpdate');
		if (showUpdatedScriptOption()) imports.push('onUpdated');
		if (showActivatedScriptOption()) imports.push('onActivated');
		if (showDeactivatedScriptOption()) imports.push('onDeactivated');
		if (showBeforeUnmountScriptOption()) imports.push('onBeforeUnmount');
		if (showUnmountedScriptOption()) imports.push('onUnmounted');
		if (showErrorCapturedScriptOption()) imports.push('onErrorCaptured');
		if (showRenderTrackedScriptOption()) imports.push('onRenderTracked');
		if (showRenderTriggeredScriptOption()) imports.push('onRenderTriggered');
	}
	return `import { ${imports.join(', ')} } from 'vue'` + `\n\n`;
};

const generateProps = (): string => {
	if (!showPropsScriptOption()) return '';
	return `const props = defineProps({` + `\n` +
		generatePropsVModel() +
		`});` + `\n\n`;
};

const generatePropsVModel = (): string => {
	if (!showVModelTemplate()) return `\t` + `text: String` + `\n`;
	return `\t` + `// v-model` + `\n` +
		`\t` + `modelValue: {` + `\n` +
		`${_isTs ? '\t\t' + 'type: String, ' + '\n' : ''}` +
		`\t\t` + `default: '',` + `\n` +
		`\t` + `},` + `\n`;
};

const generateEmits = (): string => {
	if (!showEmitsScriptOption()) return '';
	return `const emit = defineEmits({` + `\n` +
		generateEmitsVModel() +
		`});` + `\n\n`;
};

const generateEmitsVModel = (): string => {
	if (!showVModelTemplate()) {
		if (showPropsScriptOption()) return `\t` + `'update:text': (value${_isTs ? ': any' : ''}) => value !== null,` + `\n`;
		return `\t` + `'update:foo': (value${_isTs ? ': any' : ''}) => value !== null,` + `\n`;
	}
	return `\t` + `// v-model event with validation` + `\n` +
		`\t` + `'update:modelValue': (value${_isTs ? ': any' : ''}) => value !== null,` + `\n`;
};

const generateComputed = (): string => {
	if (!showComputedScriptOption()) return '';
	if (!showVModelTemplate()) return `const now = computed(() => Date.now());` + `\n\n`;
	return `const value = computed(` + generateComputedVModel() + `);` + `\n\n`;
};

const generateComputedVModel = (): string => {
	return `{` + `\n` +
		`\t` + `get () {` + `\n` +
		`\t\t` + `return props.modelValue;` + `\n` +
		`\t` + `},` + `\n` +
		`\t` + `set (value${_isTs ? ': any' : ''}) {` + `\n` +
		`${showEmitsScriptOption() ? `\t\t` + `emit('update:modelValue', value);` + `\n` : ''}` +
		`\t` + `},` + `\n` +
		`}`;
};

const generateWatch = (): string => {
	if (!showWatchScriptOption()) return '';
	return `const stopWatch = watch(` + `\n` +
		`\t` + generateWatchVModel() + `, async (_newValue${_isTs ? ': any' : ''}, _oldValue${_isTs ? ': any' : ''}) => {` + `\n` +
		`\t\t` + `// do something` + `\n` +
		`\t` + `},` + `\n` +
		`\t` + `{` + `\n` +
		`\t\t` + `immediate: true` + `\n` +
		`\t` + `}` + `\n` +
		`);` + `\n\n`;
};

const generateWatchVModel = (): string => {
	if (!showVModelTemplate()) {
		if (!showPropsScriptOption()) return `() => new Date()`;
		return `() => props.text`;
	}
	return `() => props.modelValue`;
};

const generateBeforeMount = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showBeforeMountScriptOption()) return '';
	return `onBeforeMount(() => {` + `\n` +
		`});` + `\n\n`;
};

const generateMounted = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showMountedScriptOption()) return '';
	return `onMounted(() => {` + `\n` +
		`});` + `\n\n`;
};

const generateBeforeUpdate = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showBeforeUpdateScriptOption()) return '';
	return `onBeforeUpdate(() => {` + `\n` +
		`});` + `\n\n`;
};

const generateUpdated = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showUpdatedScriptOption()) return '';
	return `onUpdated(() => {` + `\n` +
		`});` + `\n\n`;
};

const generateActivated = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showActivatedScriptOption()) return '';
	return `onActivated(() => {` + `\n` +
		`});` + `\n\n`;
};

const generateDeactivated = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showDeactivatedScriptOption()) return '';
	return `onDeactivated(() => {` + `\n` +
		`});` + `\n\n`;
};

const generateBeforeUnmount = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showBeforeUnmountScriptOption()) return '';
	return `onBeforeUnmount(() => {` + `\n` +
		`${showWatchScriptOption() ? `\t` + `stopWatch();` + `\n` : ''}` +
		`});` + `\n\n`;
};

const generateUnmounted = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showUnmountedScriptOption()) return '';
	return `onUnmounted(() => {` + `\n` +
		`});` + `\n\n`;
};

const generateErrorCaptured = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showErrorCapturedScriptOption()) return '';
	return `onErrorCaptured(() => {` + `\n` +
		`});` + `\n\n`;
};

const generateRenderTracked = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showRenderTrackedScriptOption()) return '';
	return `onRenderTracked(() => {` + `\n` +
		`});` + `\n\n`;
};

const generateRenderTriggered = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showRenderTriggeredScriptOption()) return '';
	return `onRenderTriggered(() => {` + `\n` +
		`});` + `\n\n`;
};