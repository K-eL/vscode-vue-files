import { ConfigHelper } from "../helpers/config.helper";

let _isTs: boolean = false;
let _configHelper = new ConfigHelper();
let ind: (x?: number) => string;

export const generateOptionsApiScriptTemplate = (
	componentName: string,
	isTs: boolean,
	configHelper: ConfigHelper,
): string => {
	_isTs = isTs;
	_configHelper = configHelper;
	ind = _configHelper.ind;
	return (
		generateImportStatement() +
		`export default defineComponent({` +
		`\n` +
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
		`});` +
		`\n`
	);
};

const generateImportStatement = (): string => {
	const imports = ["defineComponent"];
	return `import { ${imports.join(", ")} } from 'vue'` + `\n\n`;
};

const generateName = (name: string): string => {
	if (!_configHelper.showNameScriptOption()) return "";
	return ind() + `name: '${name}',` + `\n`;
};

const generateComponents = (): string => {
	if (!_configHelper.showComponentsScriptOption()) return "";
	return ind() + `components: {` + `\n` + ind() + `},` + `\n`;
};

const generateDirectives = (): string => {
	if (!_configHelper.showDirectivesScriptOption()) return "";
	return ind() + `directives: {` + `\n` + ind() + `},` + `\n`;
};

const generateExtends = (): string => {
	if (!_configHelper.showExtendsScriptOption()) return "";
	return ind() + `extends: {` + `\n` + ind() + `},` + `\n`;
};

const generateMixins = (): string => {
	if (!_configHelper.showMixinsScriptOption()) return "";
	return ind() + `mixins: [` + `\n` + ind() + `],` + `\n`;
};

const generateProvideInject = (): string => {
	if (!_configHelper.showProvideInjectScriptOption()) return "";
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

const generateInheritAttrs = (): string => {
	if (!_configHelper.showInheritAttrsScriptOption()) return "";
	return ind() + `inheritAttrs: false,` + `\n`;
};

const generateProps = (): string => {
	if (!_configHelper.showPropsScriptOption()) return "";
	return (
		ind() + `props: {` + `\n` + generatePropsVModel() + ind() + `},` + `\n`
	);
};

const generatePropsVModel = (): string => {
	if (!_configHelper.showVModelTemplate()) return "";
	return (
		ind(2) +
		`// v-model` +
		`\n` +
		ind(2) +
		`modelValue: {` +
		`\n` +
		`${_isTs ? ind(3) + "type: String, " + "\n" : ""}` +
		ind(3) +
		`default: '',` +
		`\n` +
		ind(2) +
		`},` +
		`\n`
	);
};

const generateEmits = (): string => {
	if (!_configHelper.showEmitsScriptOption()) return "";
	return (
		ind() + `emits: {` + `\n` + generateEmitsVModel() + ind() + `},` + `\n`
	);
};

const generateEmitsVModel = (): string => {
	if (!_configHelper.showVModelTemplate()) return "";
	return (
		ind(2) +
		`// v-model event with validation` +
		`\n` +
		ind(2) +
		`'update:modelValue': (value${_isTs ? ": any" : ""}) => value !== null,` +
		`\n`
	);
};

const generateSetup = (): string => {
	if (!_configHelper.showSetupScriptOption()) return "";
	return ind() + `setup() {` + `\n` + ind() + `},` + `\n`;
};

const generateData = (): string => {
	if (!_configHelper.showDataScriptOption()) return "";
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

const generateComputed = (): string => {
	if (!_configHelper.showComputedScriptOption()) return "";
	return (
		ind() +
		`computed: {` +
		`\n` +
		generateComputedVModel() +
		ind() +
		`},` +
		`\n`
	);
};

const generateComputedVModel = (): string => {
	if (!_configHelper.showVModelTemplate()) return "";
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
		`set (value${_isTs ? ": any" : ""}) {` +
		`\n` +
		`${
			_configHelper.showEmitsScriptOption()
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

const generateWatch = (): string => {
	if (!_configHelper.showWatchScriptOption()) return "";
	return (
		ind() + `watch: {` + `\n` + generateWatchVModel() + ind() + `},` + `\n`
	);
};

const generateWatchVModel = (): string => {
	if (!_configHelper.showVModelTemplate()) return "";
	return (
		ind(2) +
		`modelValue: {` +
		`\n` +
		ind(3) +
		`async handler (_newValue${_isTs ? ": any" : ""}, _oldValue${
			_isTs ? ": any" : ""
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

const generateBeforeCreate = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showBeforeCreateScriptOption()
	)
		return "";
	return ind() + `beforeCreate() {` + `\n` + ind() + `},` + `\n`;
};

const generateCreated = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showCreatedScriptOption()
	)
		return "";
	return ind() + `created() {` + `\n` + ind() + `},` + `\n`;
};

const generateBeforeMount = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showBeforeMountScriptOption()
	)
		return "";
	return ind() + `beforeMount() {` + `\n` + ind() + `},` + `\n`;
};

const generateMounted = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showMountedScriptOption()
	)
		return "";
	return ind() + `mounted() {` + `\n` + ind() + `},` + `\n`;
};

const generateBeforeUpdate = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showBeforeUpdateScriptOption()
	)
		return "";
	return ind() + `beforeUpdate() {` + `\n` + ind() + `},` + `\n`;
};

const generateUpdated = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showUpdatedScriptOption()
	)
		return "";
	return ind() + `updated() {` + `\n` + ind() + `},` + `\n`;
};

const generateActivated = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showActivatedScriptOption()
	)
		return "";
	return ind() + `activated() {` + `\n` + ind() + `},` + `\n`;
};

const generateDeactivated = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showDeactivatedScriptOption()
	)
		return "";
	return ind() + `deactivated() {` + `\n` + ind() + `},` + `\n`;
};

const generateBeforeUnmount = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showBeforeUnmountScriptOption()
	)
		return "";
	return (
		ind() +
		`beforeUnmount() {` +
		`\n` +
		generateBeforeUnmountVModel() +
		ind() +
		`},` +
		`\n`
	);
};

const generateBeforeUnmountVModel = (): string => {
	if (
		!_configHelper.showVModelTemplate() ||
		!_configHelper.showWatchScriptOption()
	)
		return "";
	return (
		ind(2) +
		`// stop the wacher on modelValue` +
		`\n` +
		ind(2) +
		`this.$watch('modelValue', () => {}, {});` +
		`\n`
	);
};

const generateUnmounted = (): string => {
	if (
		!_configHelper.showLifecycleHooksScriptOptions() ||
		!_configHelper.showUnmountedScriptOption()
	)
		return "";
	return ind() + `unmounted() {` + `\n` + ind() + `},` + `\n`;
};

const generateErrorCaptured = (): string => {
	if (!_configHelper.showErrorCapturedScriptOption()) return "";
	return ind() + `errorCaptured() {` + `\n` + ind() + `},` + `\n`;
};

const generateRenderTracked = (): string => {
	if (!_configHelper.showRenderTrackedScriptOption()) return "";
	return ind() + `renderTracked() {` + `\n` + ind() + `},` + `\n`;
};

const generateRenderTriggered = (): string => {
	if (!_configHelper.showRenderTriggeredScriptOption()) return "";
	return ind() + `renderTriggered() {` + `\n` + ind() + `},` + `\n`;
};

const generateMethods = (): string => {
	if (!_configHelper.showMethodsScriptOption()) return "";
	return ind() + `methods: {` + `\n` + ind() + `},` + `\n`;
};
