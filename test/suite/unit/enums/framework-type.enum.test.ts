import { expect } from "chai";
import { FrameworkType } from "../../../../src/enums/framework-type.enum";

suite("FrameworkType Enum", () => {
	test("should have Nuxt framework type", () => {
		expect(FrameworkType.Nuxt).to.equal("nuxt");
	});

	test("should have Vite framework type", () => {
		expect(FrameworkType.Vite).to.equal("vite");
	});

	test("should have VueCli framework type", () => {
		expect(FrameworkType.VueCli).to.equal("vue-cli");
	});

	test("should have None framework type", () => {
		expect(FrameworkType.None).to.equal("none");
	});

	test("should have exactly 4 framework types", () => {
		const types = Object.values(FrameworkType);
		expect(types).to.have.lengthOf(4);
	});

	test("should have all expected framework types", () => {
		const expectedTypes = ["nuxt", "vite", "vue-cli", "none"];
		const types = Object.values(FrameworkType);
		expect(types).to.deep.equal(expectedTypes);
	});
});
