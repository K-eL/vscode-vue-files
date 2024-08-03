import { VueScriptLang } from "../enums/vue-script-lang.enum";
import { VueStyleLang } from "../enums/vue-style-lang.enum";

export interface FileSettings {
	isSetupApi: boolean;
	scriptLang: VueScriptLang;
	styleLang: VueStyleLang;
	componentName: string;
}
