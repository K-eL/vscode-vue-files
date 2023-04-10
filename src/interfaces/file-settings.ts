import { VueStyleLang } from "../enums/vue-style-lang.enum";

export interface FileSettings {
	isSetupApi: boolean;
	isScriptFirst: boolean;
	scriptLang: VueScriptLang;
	styleLang: VueStyleLang;
	componentName: string;
}