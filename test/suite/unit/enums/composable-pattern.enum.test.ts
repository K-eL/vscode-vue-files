import { expect } from "chai";
import { ComposablePattern } from "../../../../src/enums/composable-pattern.enum";

suite("ComposablePattern Enum", () => {
	test("should have useState pattern", () => {
		expect(ComposablePattern.useState).to.equal("useState");
	});

	test("should have useFetch pattern", () => {
		expect(ComposablePattern.useFetch).to.equal("useFetch");
	});

	test("should have useEventListener pattern", () => {
		expect(ComposablePattern.useEventListener).to.equal("useEventListener");
	});

	test("should have custom pattern", () => {
		expect(ComposablePattern.custom).to.equal("custom");
	});

	test("should have exactly 4 patterns", () => {
		const patterns = Object.values(ComposablePattern);
		expect(patterns).to.have.lengthOf(4);
	});

	test("should have all expected patterns", () => {
		const expectedPatterns = ["useState", "useFetch", "useEventListener", "custom"];
		const patterns = Object.values(ComposablePattern);
		expect(patterns).to.deep.equal(expectedPatterns);
	});
});
