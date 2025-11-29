import { expect } from "chai";
import {
	GeneratorContext,
	createGeneratorContext,
} from "../../../../src/interfaces/generator-context";
import { createTestConfigHelper } from "../../../__helpers__";

suite("GeneratorContext", () => {
	suite("createGeneratorContext", () => {
		let configHelper: ReturnType<typeof createTestConfigHelper>;

		setup(() => {
			configHelper = createTestConfigHelper();
		});

		test("should create context with TypeScript flag true", () => {
			const ctx = createGeneratorContext(true, configHelper);

			expect(ctx.isTs).to.be.true;
			expect(ctx.config).to.equal(configHelper);
			expect(ctx.ind).to.be.a("function");
		});

		test("should create context with TypeScript flag false", () => {
			const ctx = createGeneratorContext(false, configHelper);

			expect(ctx.isTs).to.be.false;
			expect(ctx.config).to.equal(configHelper);
			expect(ctx.ind).to.be.a("function");
		});

		test("should use indentation function from config", () => {
			const ctx = createGeneratorContext(true, configHelper);

			// Default indentation should be 2 spaces
			expect(ctx.ind(1)).to.equal("  ");
			expect(ctx.ind(2)).to.equal("    ");
			expect(ctx.ind(3)).to.equal("      ");
		});

		test("should use tab indentation when configured", () => {
			const tabConfigHelper = createTestConfigHelper({
				editorOverrides: {
					insertSpaces: false,
					tabSize: 4,
				},
			});
			const ctx = createGeneratorContext(true, tabConfigHelper);

			expect(ctx.ind(1)).to.equal("\t");
			expect(ctx.ind(2)).to.equal("\t\t");
		});

		test("should return correct ind function type", () => {
			const ctx = createGeneratorContext(true, configHelper);

			expect(typeof ctx.ind).to.equal("function");
			expect(typeof ctx.ind(1)).to.equal("string");
		});
	});

	suite("GeneratorContext interface", () => {
		test("should conform to expected shape", () => {
			const configHelper = createTestConfigHelper();
			const ctx: GeneratorContext = {
				isTs: true,
				config: configHelper,
				ind: configHelper.ind,
			};

			expect(ctx).to.have.property("isTs");
			expect(ctx).to.have.property("config");
			expect(ctx).to.have.property("ind");
		});
	});
});
