import {
	showActivatedScriptOption,
	showBeforeCreateScriptOption,
	showBeforeMountScriptOption,
	showBeforeUnmountScriptOption,
	showBeforeUpdateScriptOption,
	showComponentsScriptOption,
	showComputedScriptOption,
	showCreatedScriptOption,
	showDataScriptOption,
	showDeactivatedScriptOption,
	showDirectivesScriptOption,
	showEmitsScriptOption,
	showErrorCapturedScriptOption,
	showExtendsScriptOption,
	showInheritAttrsScriptOption,
	showLifecycleHooksScriptOptions,
	showMethodsScriptOption,
	showMixinsScriptOption,
	showMountedScriptOption,
	showNameScriptOption,
	showPropsScriptOption,
	showProvideInjectScriptOption,
	showRenderTrackedScriptOption,
	showRenderTriggeredScriptOption,
	showSetupScriptOption,
	showUnmountedScriptOption,
	showUpdatedScriptOption,
	showVModelTemplate,
	showWatchScriptOption
} from "../helpers/config.helper";

let _isTs: boolean = false;

export const generateOptionsApiScriptTemplate = (componentName: string, isTs: boolean): string => {
	_isTs = isTs;
	return generateImportStatement() +
		`export default defineComponent({` + `\n` +
		generateName(componentName) +
		generateComponents() +
		generateDirectives() +
		generateExtends() +
		generateMixins() +
		generateProvideInject() +
		generateInheritAttrs() +
		generateProps() +
		generateEmits() +
		generateSetup() +
		generateData() +
		generateComputed() +
		generateWatch() +
		generateBeforeCreate() +
		generateCreated() +
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
		generateRenderTriggered() +
		generateMethods() +
		// render / template
		`});` + `\n`;
};

const generateImportStatement = (): string => {
	const imports = ['defineComponent'];
	return `import { ${imports.join(', ')} } from 'vue'` + `\n\n`;
};

const generateName = (name: string): string => {
	if (!showNameScriptOption()) return '';
	return `\t` + `name: '${name}',` + `\n`;
};

const generateComponents = (): string => {
	if (!showComponentsScriptOption()) return '';
	return `\t` + `components: {` + `\n` +
		`\t` + `},` + `\n`;
};

const generateDirectives = (): string => {
	if (!showDirectivesScriptOption()) return '';
	return `\t` + `directives: {` + `\n` +
		`\t` + `},` + `\n`;
};

const generateExtends = (): string => {
	if (!showExtendsScriptOption()) return '';
	return `\t` + `extends: {` + `\n` +
		`\t` + `},` + `\n`;
};

const generateMixins = (): string => {
	if (!showMixinsScriptOption()) return '';
	return `\t` + `mixins: [` + `\n` +
		`\t` + `],` + `\n`;
};

const generateProvideInject = (): string => {
	if (!showProvideInjectScriptOption()) return '';
	return `\t` + `provide: {` + `\n` +
		`\t` + `},` + `\n` +
		`\t` + `inject: {` + `\n` +
		`\t` + `},` + `\n`;
};

const generateInheritAttrs = (): string => {
	if (!showInheritAttrsScriptOption()) return '';
	return `\t` + `inheritAttrs: false,` + `\n`;
};

const generateProps = (): string => {
	if (!showPropsScriptOption()) return '';
	return `\t` + `props: {` + `\n` +
		generatePropsVModel() +
		`\t` + `},` + `\n`;
};

const generatePropsVModel = (): string => {
	if (!showVModelTemplate()) return '';
	return `\t\t` + `// v-model` + `\n` +
		`\t\t` + `modelValue: {` + `\n` +
		`${_isTs ? '\t\t\t' + 'type: String, ' + '\n' : ''}` +
		`\t\t\t` + `default: '',` + `\n` +
		`\t\t` + `},` + `\n`;
};

const generateEmits = (): string => {
	if (!showEmitsScriptOption()) return '';
	return `\t` + `emits: {` + `\n` +
		generateEmitsVModel() +
		`\t` + `},` + `\n`;
};

const generateEmitsVModel = (): string => {
	if (!showVModelTemplate()) return '';
	return `\t\t` + `// v-model event with validation` + `\n` +
		`\t\t` + `'update:modelValue': (value${_isTs ? ': any' : ''}) => value !== null,` + `\n`;
};

const generateSetup = (): string => {
	if (!showSetupScriptOption()) return '';
	return `\t` + `setup() {` + `\n` +
		`\t` + `},` + `\n`;
};

const generateData = (): string => {
	if (!showDataScriptOption()) return '';
	return `\t` + `data() {` + `\n` +
		`\t\t` + `return {` + `\n` +
		`\t\t` + `};` + `\n` +
		`\t` + `},` + `\n`;
};

const generateComputed = (): string => {
	if (!showComputedScriptOption()) return '';
	return `\t` + `computed: {` + `\n` +
		generateComputedVModel() +
		`\t` + `},` + `\n`;
};

const generateComputedVModel = (): string => {
	if (!showVModelTemplate()) return '';
	return `\t\t` + `value: {` + `\n` +
		`\t\t\t` + `get () {` + `\n` +
		`\t\t\t\t` + `return this.modelValue;` + `\n` +
		`\t\t\t` + `},` + `\n` +
		`\t\t\t` + `set (value${_isTs ? ': any' : ''}) {` + `\n` +
		`${showEmitsScriptOption() ? `\t\t\t\t` + `this.$emit('update:modelValue', value);` + `\n` : ''}` +
		`\t\t\t` + `},` + `\n` +
		`\t\t` + `},` + `\n`;
};

const generateWatch = (): string => {
	if (!showWatchScriptOption()) return '';
	return `\t` + `watch: {` + `\n` +
		generateWatchVModel() +
		`\t` + `},` + `\n`;
};

const generateWatchVModel = (): string => {
	if (!showVModelTemplate()) return '';
	return `\t\t` + `modelValue: {` + `\n` +
		`\t\t\t` + `async handler (_newValue${_isTs ? ': any' : ''}, _oldValue${_isTs ? ': any' : ''}) {` + `\n` +
		`\t\t\t\t` + `// do something` + `\n` +
		`\t\t\t` + `},` + `\n` +
		`\t\t\t` + `immediate: true` + `\n` +
		`\t\t` + `},` + `\n`;
};

const generateBeforeCreate = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showBeforeCreateScriptOption()) return '';
	return `\t` + `beforeCreate() {` + `\n` +
		`\t` + `},` + `\n`;
};

const generateCreated = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showCreatedScriptOption()) return '';
	return `\t` + `created() {` + `\n` +
		`\t` + `},` + `\n`;
};

const generateBeforeMount = (): string => {
	if (!showLifecycleHooksScriptOptions() || showBeforeMountScriptOption()) return '';
	return `\t` + `beforeMount() {` + `\n` +
		`\t` + `},` + `\n`;
};

const generateMounted = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showMountedScriptOption()) return '';
	return `\t` + `mounted() {` + `\n` +
		`\t` + `},` + `\n`;
};

const generateBeforeUpdate = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showBeforeUpdateScriptOption()) return '';
	return `\t` + `beforeUpdate() {` + `\n` +
		`\t` + `},` + `\n`;
};

const generateUpdated = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showUpdatedScriptOption()) return '';
	return `\t` + `updated() {` + `\n` +
		`\t` + `},` + `\n`;
};

const generateActivated = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showActivatedScriptOption()) return '';
	return `\t` + `activated() {` + `\n` +
		`\t` + `},` + `\n`;
};

const generateDeactivated = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showDeactivatedScriptOption()) return '';
	return `\t` + `deactivated() {` + `\n` +
		`\t` + `},` + `\n`;
};

const generateBeforeUnmount = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showBeforeUnmountScriptOption()) return '';
	return `\t` + `beforeUnmount() {` + `\n` +
		generateBeforeUnmountVModel() +
		`\t` + `},` + `\n`;
};

const generateBeforeUnmountVModel = (): string => {
	if (!showVModelTemplate() || !showWatchScriptOption()) return '';
	return `\t\t` + `// stop the wacher on modelValue` + `\n` +
		`\t\t` + `this.$watch('modelValue', () => {}, {});` + `\n`;
};

const generateUnmounted = (): string => {
	if (!showLifecycleHooksScriptOptions() || !showUnmountedScriptOption()) return '';
	return `\t` + `unmounted() {` + `\n` +
		`\t` + `},` + `\n`;
};

const generateErrorCaptured = (): string => {
	if (!showErrorCapturedScriptOption()) return '';
	return `\t` + `errorCaptured() {` + `\n` +
		`\t` + `},` + `\n`;
};

const generateRenderTracked = (): string => {
	if (!showRenderTrackedScriptOption()) return '';
	return `\t` + `renderTracked() {` + `\n` +
		`\t` + `},` + `\n`;
};

const generateRenderTriggered = (): string => {
	if (!showRenderTriggeredScriptOption()) return '';
	return `\t` + `renderTriggered() {` + `\n` +
		`\t` + `},` + `\n`;
};

const generateMethods = (): string => {
	if (!showMethodsScriptOption()) return '';
	return `\t` + `methods: {` + `\n` +
		`\t` + `},` + `\n`;
};