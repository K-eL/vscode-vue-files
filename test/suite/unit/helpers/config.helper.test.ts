import * as vscode from "vscode";
import * as assert from "assert";
import { before, beforeEach } from "mocha";
import { ConfigHelper } from "../../../../src/helpers/config.helper";

suite("Config Helper", () => {
	let _configHelper: ConfigHelper;
	const _mockedEditorConfig: vscode.WorkspaceConfiguration = {
		get: (key: string) => {
			switch (key) {
				case "insertSpaces":
					return false;
				case "tabSize":
					return 2;
				default:
					return null;
			}
		},
		has: (_: string) => {
			return true;
		},
		update: () => {
			return Promise.resolve();
		},
		inspect: () => {
			return null as any;
		},
	};
	const _mockedVueFilesConfig: vscode.WorkspaceConfiguration = {
		get: (key: string) => {
			switch (key) {
				case "fileStructure.scriptTagComesFirst":
					return false;
				case "template.showV-ModelTemplate":
					return true;
				case "option.showNameScriptOption":
					return undefined;
				case "option.showMethodsScriptOption":
					return null;
				default:
					return null;
			}
		},
		has: (_: string) => {
			return true;
		},
		update: () => {
			return Promise.resolve();
		},
		inspect: () => {
			return null as any;
		},
	};

	before(() => {
		_configHelper = new ConfigHelper();
	});

	beforeEach(() => {
		_configHelper["_editorConfig"] = _mockedEditorConfig;
		_configHelper["_vueFilesConfig"] = _mockedVueFilesConfig;
	});

	test("should return the correct indentation", () => {
		const arrange = [
			{
				useTabs: false,
				tabSize: 1,
				result: " ",
			},
			{
				useTabs: false,
				tabSize: 2,
				result: "  ",
			},
			{
				useTabs: false,
				tabSize: 4,
				result: "    ",
			},
			{
				useTabs: true,
				tabSize: 1,
				result: "\t",
			},
			{
				useTabs: true,
				tabSize: 2,
				result: "\t",
			},
			{
				useTabs: true,
				tabSize: 4,
				result: "\t",
			},
		];

		arrange.forEach(item => {
			_configHelper["_useTabs"] = item.useTabs;
			_configHelper["_tabSize"] = item.tabSize;
			let actual = _configHelper.ind();
			assert.strictEqual(actual, item.result);
			actual = _configHelper.ind(2);
			assert.strictEqual(actual, item.result.repeat(2));
			actual = _configHelper.ind(3);
			assert.strictEqual(actual, item.result.repeat(3));
		});
	});

	test("should return the proper value of the config option", () => {
		// false should return false
		let actual = _configHelper.isScriptFirst();
		assert.strictEqual(actual, false);
		// true should return true
		actual = _configHelper.showVModelTemplate();
		assert.strictEqual(actual, true);
		// undefined should return true
		actual = _configHelper.options.showName();
		assert.strictEqual(actual, true);
		// null should return true
		actual = _configHelper.options.showMethods();
		assert.strictEqual(actual, true);
	});
});
