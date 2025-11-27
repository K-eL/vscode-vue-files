import { defineConfig } from "@vscode/test-cli";

export default defineConfig({
	files: "out/test/**/*.test.js",
	coverage: {
		includeAll: true,
		include: ["out/src/**/*.js"],
		exclude: [
			"out/src/test/**",
			"out/src/extension.js",
			"out/src/commands/create-files-for-test.command.js"
		],
		reporter: ["text", "html", "lcov"],
		output: "./coverage"
	}
});
