import * as assert from "assert";
import { handleVueFileName } from "../../../helpers/file.helper";

suite("File Helper", () => {
	test("should return the correct file name", () => {
		const fileName = "test";
		const expected = "test.vue";
		const actual = handleVueFileName(fileName);
		assert.strictEqual(actual, expected);
	});
	test("should return the correct file name when the file name already has a file extension", () => {
		const fileName = "test.vue";
		const expected = "test.vue";
		const actual = handleVueFileName(fileName);
		assert.strictEqual(actual, expected);
	});
	test("should return the correct file name when the file name already has a file extension and the file name is capitalized", () => {
		const fileName = "Test.vue";
		const expected = "Test.vue";
		const actual = handleVueFileName(fileName);
		assert.strictEqual(actual, expected);
	});
	test("should return the correct file name when the file name already has a file extension and the file name is capitalized and has spaces", () => {
		const fileName = "Test File.vue";
		const expected = "Test-File.vue";
		const actual = handleVueFileName(fileName);
		assert.strictEqual(actual, expected);
	});
	test("should return the correct file name when the file name already has a file extension and the file name is capitalized and has spaces and has a dash", () => {
		const fileName = "Test-File.vue";
		const expected = "Test-File.vue";
		const actual = handleVueFileName(fileName);
		assert.strictEqual(actual, expected);
	});
	test("should return the correct file name when the file name already has a file extension and the file name has two capitalized words", () => {
		const fileName = "TestFile.vue";
		const expected = "TestFile.vue";
		const actual = handleVueFileName(fileName);
		assert.strictEqual(actual, expected);
	});
});
