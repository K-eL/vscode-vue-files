import { expect } from "chai";
import { VueScriptLang } from "../../../../src/enums/vue-script-lang.enum";

suite("VueScriptLang Enum", () => {
	test("should have TypeScript script language", () => {
		expect(VueScriptLang.typeScript).to.equal("ts");
	});

	test("should have JavaScript script language", () => {
		expect(VueScriptLang.javaScript).to.equal("js");
	});

	test("should have exactly 2 script languages", () => {
		const langs = Object.values(VueScriptLang);
		expect(langs).to.have.lengthOf(2);
	});

	test("should have all expected script languages", () => {
		const expectedLangs = ["ts", "js"];
		const langs = Object.values(VueScriptLang);
		expect(langs).to.deep.equal(expectedLangs);
	});
});
