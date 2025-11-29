import { expect } from "chai";
import { PiniaStoreType } from "../../../../src/enums/pinia-store-type.enum";

suite("PiniaStoreType Enum", () => {
	test("should have options store type", () => {
		expect(PiniaStoreType.options).to.equal("options");
	});

	test("should have setup store type", () => {
		expect(PiniaStoreType.setup).to.equal("setup");
	});

	test("should have exactly 2 store types", () => {
		const types = Object.values(PiniaStoreType);
		expect(types).to.have.lengthOf(2);
	});

	test("should have all expected store types", () => {
		const expectedTypes = ["options", "setup"];
		const types = Object.values(PiniaStoreType);
		expect(types).to.deep.equal(expectedTypes);
	});
});
