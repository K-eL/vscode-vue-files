import { expect } from "chai";
import {
	commandDefinitions,
	registerAllCommands,
	getCommandCount,
} from "../../../../src/commands/command-registry";

suite("Command Registry", () => {
	suite("commandDefinitions", () => {
		test("should have all expected command definitions", () => {
			expect(commandDefinitions).to.be.an("array");
			expect(commandDefinitions.length).to.be.greaterThan(0);
		});

		test("should have unique command IDs", () => {
			const ids = commandDefinitions.map((cmd) => cmd.id);
			const uniqueIds = new Set(ids);
			expect(uniqueIds.size).to.equal(ids.length);
		});

		test("should have all commands with id and handler", () => {
			for (const command of commandDefinitions) {
				expect(command).to.have.property("id").that.is.a("string");
				expect(command).to.have.property("handler").that.is.a("function");
			}
		});

		test("should include quick pick command", () => {
			const quickPickCmd = commandDefinitions.find(
				(cmd) => cmd.id === "vscode-vue-files.createVueComponentQuick",
			);
			expect(quickPickCmd).to.not.be.undefined;
			expect(quickPickCmd?.needsContext).to.be.true;
		});

		test("should include all Composition API commands", () => {
			const setupCommands = [
				"vscode-vue-files.vueSetupTsScss",
				"vscode-vue-files.vueSetupTsCss",
				"vscode-vue-files.vueSetupJsScss",
				"vscode-vue-files.vueSetupJsCss",
			];

			for (const cmdId of setupCommands) {
				const cmd = commandDefinitions.find((c) => c.id === cmdId);
				expect(cmd, `Command ${cmdId} should exist`).to.not.be.undefined;
			}
		});

		test("should include all Options API commands", () => {
			const optionsCommands = [
				"vscode-vue-files.vueOptionsTsScss",
				"vscode-vue-files.vueOptionsTsCss",
				"vscode-vue-files.vueOptionsJsScss",
				"vscode-vue-files.vueOptionsJsCss",
			];

			for (const cmdId of optionsCommands) {
				const cmd = commandDefinitions.find((c) => c.id === cmdId);
				expect(cmd, `Command ${cmdId} should exist`).to.not.be.undefined;
			}
		});

		test("should include Pinia store command", () => {
			const piniaCmd = commandDefinitions.find(
				(cmd) => cmd.id === "vscode-vue-files.createPiniaStore",
			);
			expect(piniaCmd).to.not.be.undefined;
		});

		test("should include Composable command", () => {
			const composableCmd = commandDefinitions.find(
				(cmd) => cmd.id === "vscode-vue-files.createComposable",
			);
			expect(composableCmd).to.not.be.undefined;
		});

		test("should include dev test command", () => {
			const devCmd = commandDefinitions.find(
				(cmd) => cmd.id === "vscode-vue-files.devEnvTest",
			);
			expect(devCmd).to.not.be.undefined;
		});
	});

	suite("getCommandCount", () => {
		test("should return correct number of commands", () => {
			const count = getCommandCount();
			expect(count).to.equal(commandDefinitions.length);
		});

		test("should return a positive number", () => {
			const count = getCommandCount();
			expect(count).to.be.greaterThan(0);
		});

		test("should return at least 11 commands (all defined commands)", () => {
			const count = getCommandCount();
			// 1 quick pick + 4 setup + 4 options + 1 pinia + 1 composable + 1 dev = 12
			expect(count).to.be.greaterThanOrEqual(11);
		});
	});

	suite("Command Definition Structure", () => {
		test("should have needsContext only for quick pick command", () => {
			const commandsWithContext = commandDefinitions.filter(
				(cmd) => cmd.needsContext === true,
			);
			expect(commandsWithContext.length).to.equal(1);
			expect(commandsWithContext[0].id).to.equal(
				"vscode-vue-files.createVueComponentQuick",
			);
		});

		test("should have all command IDs prefixed with vscode-vue-files", () => {
			for (const command of commandDefinitions) {
				expect(command.id).to.match(/^vscode-vue-files\./);
			}
		});
	});
});
