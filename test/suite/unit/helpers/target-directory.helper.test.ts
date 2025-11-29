import { expect } from "chai";
import * as sinon from "sinon";
import * as vscode from "vscode";
import {
	checkIfInSubdirectory,
	ensureDirectoryExists,
	fileExists,
	getBaseDirectory,
	getTargetDirectory,
	type TargetDirectoryOptions,
} from "../../../../src/helpers/target-directory.helper";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

suite("Target Directory Helper", () => {
	suite("checkIfInSubdirectory", () => {
		const defaultOptions: TargetDirectoryOptions = {
			createSubdirectory: true,
			subdirectoryName: "composables",
			subdirectoryAliases: ["composable"],
		};

		test("should return true when directory name matches subdirectoryName", () => {
			const result = checkIfInSubdirectory(
				"/project/src/composables",
				defaultOptions,
			);
			expect(result).to.be.true;
		});

		test("should return true when directory name matches alias", () => {
			const result = checkIfInSubdirectory(
				"/project/src/composable",
				defaultOptions,
			);
			expect(result).to.be.true;
		});

		test("should return false when directory name does not match", () => {
			const result = checkIfInSubdirectory("/project/src/utils", defaultOptions);
			expect(result).to.be.false;
		});

		test("should be case-insensitive for directory name", () => {
			const result = checkIfInSubdirectory(
				"/project/src/COMPOSABLES",
				defaultOptions,
			);
			expect(result).to.be.true;
		});

		test("should be case-insensitive for alias", () => {
			const result = checkIfInSubdirectory(
				"/project/src/COMPOSABLE",
				defaultOptions,
			);
			expect(result).to.be.true;
		});

		test("should handle options without aliases", () => {
			const options: TargetDirectoryOptions = {
				createSubdirectory: true,
				subdirectoryName: "stores",
			};
			const result = checkIfInSubdirectory("/project/src/stores", options);
			expect(result).to.be.true;
		});

		test("should return false when no aliases and name does not match", () => {
			const options: TargetDirectoryOptions = {
				createSubdirectory: true,
				subdirectoryName: "stores",
			};
			const result = checkIfInSubdirectory("/project/src/composables", options);
			expect(result).to.be.false;
		});

		test("should work with 'stores' subdirectory for pinia", () => {
			const piniaOptions: TargetDirectoryOptions = {
				createSubdirectory: true,
				subdirectoryName: "stores",
				subdirectoryAliases: ["store"],
			};
			expect(checkIfInSubdirectory("/project/src/stores", piniaOptions)).to.be
				.true;
			expect(checkIfInSubdirectory("/project/src/store", piniaOptions)).to.be
				.true;
			expect(checkIfInSubdirectory("/project/src/pinia", piniaOptions)).to.be
				.false;
		});
	});

	suite("ensureDirectoryExists", () => {
		let tempDir: string;

		setup(() => {
			tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "vscode-vue-test-"));
		});

		teardown(() => {
			// Clean up temp directory
			if (fs.existsSync(tempDir)) {
				fs.rmSync(tempDir, { recursive: true, force: true });
			}
		});

		test("should return true when directory already exists", () => {
			const result = ensureDirectoryExists(tempDir);
			expect(result).to.be.true;
		});

		test("should create directory and return true when it does not exist", () => {
			const newDir = path.join(tempDir, "new-folder");
			expect(fs.existsSync(newDir)).to.be.false;

			const result = ensureDirectoryExists(newDir);
			expect(result).to.be.true;
			expect(fs.existsSync(newDir)).to.be.true;
		});

		test("should create nested directories recursively", () => {
			const nestedDir = path.join(tempDir, "level1", "level2", "level3");
			expect(fs.existsSync(nestedDir)).to.be.false;

			const result = ensureDirectoryExists(nestedDir);
			expect(result).to.be.true;
			expect(fs.existsSync(nestedDir)).to.be.true;
		});
	});

	suite("fileExists", () => {
		let tempDir: string;
		let tempFile: string;

		setup(() => {
			tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "vscode-vue-test-"));
			tempFile = path.join(tempDir, "test-file.txt");
			fs.writeFileSync(tempFile, "test content");
		});

		teardown(() => {
			// Clean up temp directory
			if (fs.existsSync(tempDir)) {
				fs.rmSync(tempDir, { recursive: true, force: true });
			}
		});

		test("should return true when file exists", () => {
			const result = fileExists(tempFile);
			expect(result).to.be.true;
		});

		test("should return false when file does not exist", () => {
			const result = fileExists(path.join(tempDir, "non-existent.txt"));
			expect(result).to.be.false;
		});

		test("should return true when directory exists", () => {
			const result = fileExists(tempDir);
			expect(result).to.be.true;
		});
	});

	suite("getBaseDirectory", () => {
		let tempDir: string;
		let tempFile: string;

		setup(() => {
			tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "vscode-vue-test-"));
			tempFile = path.join(tempDir, "test-file.vue");
			fs.writeFileSync(tempFile, "<template></template>");
		});

		teardown(() => {
			if (fs.existsSync(tempDir)) {
				fs.rmSync(tempDir, { recursive: true, force: true });
			}
		});

		test("should return directory path when URI is a directory", () => {
			const uri = vscode.Uri.file(tempDir);
			const result = getBaseDirectory(uri);

			expect(result.path).to.equal(tempDir);
			expect(result.error).to.be.undefined;
		});

		test("should return parent directory when URI is a file", () => {
			const uri = vscode.Uri.file(tempFile);
			const result = getBaseDirectory(uri);

			expect(result.path).to.equal(tempDir);
			expect(result.error).to.be.undefined;
		});

		test("should return error when URI path does not exist", () => {
			const uri = vscode.Uri.file("/non/existent/path");
			const result = getBaseDirectory(uri);

			expect(result.path).to.be.undefined;
			expect(result.error).to.equal("Failed to access the provided path");
		});
	});

	suite("getTargetDirectory", () => {
		let sandbox: sinon.SinonSandbox;
		let tempDir: string;

		setup(() => {
			sandbox = sinon.createSandbox();
			tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "vscode-vue-test-"));
		});

		teardown(() => {
			sandbox.restore();
			if (fs.existsSync(tempDir)) {
				fs.rmSync(tempDir, { recursive: true, force: true });
			}
		});

		test("should return base directory when createSubdirectory is false", async () => {
			const uri = vscode.Uri.file(tempDir);
			const options: TargetDirectoryOptions = {
				createSubdirectory: false,
				subdirectoryName: "composables",
			};

			const result = await getTargetDirectory(uri, options);

			expect(result).to.equal(tempDir);
		});

		test("should return subdirectory path when not already in target directory", async () => {
			const uri = vscode.Uri.file(tempDir);
			const options: TargetDirectoryOptions = {
				createSubdirectory: true,
				subdirectoryName: "composables",
			};

			const result = await getTargetDirectory(uri, options);

			expect(result).to.equal(path.join(tempDir, "composables"));
		});

		test("should return base directory when already in subdirectory", async () => {
			const composablesDir = path.join(tempDir, "composables");
			fs.mkdirSync(composablesDir);
			const uri = vscode.Uri.file(composablesDir);
			const options: TargetDirectoryOptions = {
				createSubdirectory: true,
				subdirectoryName: "composables",
			};

			const result = await getTargetDirectory(uri, options);

			expect(result).to.equal(composablesDir);
		});

		test("should return base directory when already in alias directory", async () => {
			const composableDir = path.join(tempDir, "composable");
			fs.mkdirSync(composableDir);
			const uri = vscode.Uri.file(composableDir);
			const options: TargetDirectoryOptions = {
				createSubdirectory: true,
				subdirectoryName: "composables",
				subdirectoryAliases: ["composable"],
			};

			const result = await getTargetDirectory(uri, options);

			expect(result).to.equal(composableDir);
		});

		test("should show error message when no workspace and no URI", async () => {
			const showErrorMessageStub = sandbox.stub(vscode.window, "showErrorMessage");
			
			// Stub workspace folders to return empty
			sandbox.stub(vscode.workspace, "workspaceFolders").value(undefined);

			const options: TargetDirectoryOptions = {
				createSubdirectory: true,
				subdirectoryName: "composables",
			};

			const result = await getTargetDirectory(undefined, options);

			expect(result).to.be.undefined;
			expect(showErrorMessageStub.calledOnce).to.be.true;
			expect(showErrorMessageStub.firstCall.args[0]).to.equal("No workspace folder open");
		});
	});
});
