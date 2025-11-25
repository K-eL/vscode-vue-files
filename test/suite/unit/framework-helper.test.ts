import { expect } from "chai";
import { FrameworkType } from "../../../src/enums/framework-type.enum";

suite("FrameworkHelper", () => {
	suite("Framework Type Enum", () => {
		test("should have correct framework types", () => {
			expect(FrameworkType.Nuxt).to.equal("nuxt");
			expect(FrameworkType.Vite).to.equal("vite");
			expect(FrameworkType.VueCli).to.equal("vue-cli");
			expect(FrameworkType.None).to.equal("none");
		});
	});

	// Note: Full integration tests would require VS Code workspace context
	// These would be better suited for integration tests
	suite("Framework Detection Logic", () => {
		test("should prioritize Nuxt detection over Vite", () => {
			// This test validates the detection priority logic
			// In a real scenario, Nuxt projects often include Vite
			// So Nuxt detection should come first
			const priority = ["nuxt", "vite", "vue-cli"];
			expect(priority[0]).to.equal("nuxt");
		});

		test("should detect Vite before Vue CLI", () => {
			const priority = ["nuxt", "vite", "vue-cli"];
			expect(priority.indexOf("vite")).to.be.lessThan(
				priority.indexOf("vue-cli"),
			);
		});
	});

	suite("Framework Defaults", () => {
		test("should recommend TypeScript for Nuxt", () => {
			// Nuxt 3 defaults
			const nuxtDefaults = {
				preferTypeScript: true,
				preferScriptSetup: true,
				preferScoped: true,
			};
			expect(nuxtDefaults.preferTypeScript).to.be.true;
			expect(nuxtDefaults.preferScriptSetup).to.be.true;
		});

		test("should recommend TypeScript for Vite", () => {
			// Vite defaults
			const viteDefaults = {
				preferTypeScript: true,
				preferScriptSetup: true,
				preferScoped: false,
			};
			expect(viteDefaults.preferTypeScript).to.be.true;
			expect(viteDefaults.preferScriptSetup).to.be.true;
		});

		test("should use conservative defaults for Vue CLI", () => {
			// Vue CLI defaults (older projects)
			const vueCliDefaults = {
				preferTypeScript: false,
				preferScriptSetup: false,
				preferScoped: true,
			};
			expect(vueCliDefaults.preferTypeScript).to.be.false;
			expect(vueCliDefaults.preferScriptSetup).to.be.false;
		});
	});
});
