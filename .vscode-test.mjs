import { defineConfig } from "@vscode/test-cli";

export default defineConfig({
	files: "out/test/**/*.test.js",
	coverage: {
		includeAll: true,
		include: ["src/**/*.ts"],
		exclude: [
			"src/test/**",
			"src/extension.ts",
			"src/commands/create-files-for-test.command.ts"
		],
		reporter: ["text", "html", "lcov"],
		output: "./coverage"
	}
});
