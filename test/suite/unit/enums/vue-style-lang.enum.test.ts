import { expect } from "chai";
import { VueStyleLang } from "../../../../src/enums/vue-style-lang.enum";

suite("VueStyleLang Enum", () => {
	test("should have SCSS style language", () => {
		expect(VueStyleLang.scss).to.equal("scss");
	});

	test("should have CSS style language", () => {
		expect(VueStyleLang.css).to.equal("css");
	});

	test("should have exactly 2 style languages", () => {
		const langs = Object.values(VueStyleLang);
		expect(langs).to.have.lengthOf(2);
	});

	test("should have all expected style languages", () => {
		const expectedLangs = ["scss", "css"];
		const langs = Object.values(VueStyleLang);
		expect(langs).to.deep.equal(expectedLangs);
	});
});
