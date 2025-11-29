import { expect } from "chai";
import { VueApiType } from "../../../../src/enums/vue-api-type.enum";

suite("VueApiType Enum", () => {
	test("should have setup API type for Composition API", () => {
		expect(VueApiType.setup).to.equal("setup");
	});

	test("should have options API type for Options API", () => {
		expect(VueApiType.options).to.equal("options");
	});

	test("should have exactly 2 API types", () => {
		const types = Object.values(VueApiType);
		expect(types).to.have.lengthOf(2);
	});

	test("should have all expected API types", () => {
		const expectedTypes = ["setup", "options"];
		const types = Object.values(VueApiType);
		expect(types).to.deep.equal(expectedTypes);
	});
});
