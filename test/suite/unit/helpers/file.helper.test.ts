import { expect } from "chai";
import * as sinon from "sinon";
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { isFileNameValid, createFile, openFile } from "../../../../src/helpers/file.helper";

suite("File Helper", () => {
	suite("isFileNameValid", () => {
		suite("Valid file names", () => {
			test("should accept simple alphanumeric names", () => {
				expect(isFileNameValid("MyComponent")).to.not.be.null;
			});

			test("should accept names with numbers", () => {
				expect(isFileNameValid("Component123")).to.not.be.null;
			});

			test("should accept kebab-case names", () => {
				expect(isFileNameValid("my-component")).to.not.be.null;
			});

			test("should accept names with dots", () => {
				expect(isFileNameValid("my.component")).to.not.be.null;
			});

			test("should accept names with underscores", () => {
				expect(isFileNameValid("my_component")).to.not.be.null;
			});

			test("should accept names with spaces", () => {
				expect(isFileNameValid("My Component")).to.not.be.null;
			});

			test("should accept single character names", () => {
				expect(isFileNameValid("a")).to.not.be.null;
			});

			test("should accept names with file extension", () => {
				expect(isFileNameValid("MyComponent.vue")).to.not.be.null;
			});

			test("should accept complex valid names", () => {
				expect(isFileNameValid("My-Component_v2.vue")).to.not.be.null;
			});

			test("should accept names with leading/trailing spaces (trimmed)", () => {
				expect(isFileNameValid("  MyComponent  ")).to.not.be.null;
			});
		});

		suite("Invalid file names", () => {
			test("should reject names with slashes", () => {
				expect(isFileNameValid("path/to/file")).to.be.null;
			});

			test("should reject names with backslashes", () => {
				expect(isFileNameValid("path\\to\\file")).to.be.null;
			});

			test("should reject names with angle brackets", () => {
				expect(isFileNameValid("<script>")).to.be.null;
			});

			test("should reject names with colons", () => {
				expect(isFileNameValid("C:file")).to.be.null;
			});

			test("should reject names with pipe characters", () => {
				expect(isFileNameValid("file|name")).to.be.null;
			});

			test("should reject names with asterisks", () => {
				expect(isFileNameValid("file*name")).to.be.null;
			});

			test("should reject names with question marks", () => {
				expect(isFileNameValid("file?name")).to.be.null;
			});

			test("should reject names with quotes", () => {
				expect(isFileNameValid('file"name')).to.be.null;
			});

			test("should reject empty names after trim", () => {
				expect(isFileNameValid("   ")).to.be.null;
			});

			test("should reject names with special characters", () => {
				expect(isFileNameValid("file@name")).to.be.null;
				expect(isFileNameValid("file#name")).to.be.null;
				expect(isFileNameValid("file$name")).to.be.null;
				expect(isFileNameValid("file%name")).to.be.null;
				expect(isFileNameValid("file^name")).to.be.null;
				expect(isFileNameValid("file&name")).to.be.null;
			});
		});
	});

	suite("createFile", () => {
		let tempDir: string;

		setup(() => {
			tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "vscode-vue-test-"));
		});

		teardown(() => {
			if (fs.existsSync(tempDir)) {
				fs.rmSync(tempDir, { recursive: true, force: true });
			}
		});

		test("should create file with correct content", async () => {
			const uri = vscode.Uri.file(path.join(tempDir, "test.vue"));
			const content = "<template></template>";

			await createFile(uri, content);

			expect(fs.existsSync(uri.fsPath)).to.be.true;
			expect(fs.readFileSync(uri.fsPath, "utf-8")).to.equal(content);
		});

		test("should handle empty content", async () => {
			const uri = vscode.Uri.file(path.join(tempDir, "empty.vue"));

			await createFile(uri, "");

			expect(fs.existsSync(uri.fsPath)).to.be.true;
			expect(fs.readFileSync(uri.fsPath, "utf-8")).to.equal("");
		});

		test("should handle multi-line content", async () => {
			const uri = vscode.Uri.file(path.join(tempDir, "multi.vue"));
			const content = "<template>\n  <div></div>\n</template>";

			await createFile(uri, content);

			expect(fs.readFileSync(uri.fsPath, "utf-8")).to.equal(content);
		});

		test("should handle special characters in content", async () => {
			const uri = vscode.Uri.file(path.join(tempDir, "special.vue"));
			const content = "<template>{{ message }}</template>";

			await createFile(uri, content);

			expect(fs.readFileSync(uri.fsPath, "utf-8")).to.equal(content);
		});

		test("should handle unicode content", async () => {
			const uri = vscode.Uri.file(path.join(tempDir, "unicode.vue"));
			const content = "<template>こんにちは 🎉</template>";

			await createFile(uri, content);

			expect(fs.readFileSync(uri.fsPath, "utf-8")).to.equal(content);
		});
	});

	suite("openFile", () => {
		let sandbox: sinon.SinonSandbox;
		let openTextDocumentStub: sinon.SinonStub;
		let showTextDocumentStub: sinon.SinonStub;
		let mockEditor: { selection: vscode.Selection | null };
		let mockDocument: vscode.TextDocument;

		setup(() => {
			sandbox = sinon.createSandbox();
			mockEditor = { selection: null };
			mockDocument = {} as vscode.TextDocument;

			openTextDocumentStub = sandbox.stub(vscode.workspace, "openTextDocument").resolves(mockDocument);
			showTextDocumentStub = sandbox.stub(vscode.window, "showTextDocument").resolves(mockEditor as unknown as vscode.TextEditor);
		});

		teardown(() => {
			sandbox.restore();
		});

		test("should call openTextDocument with correct URI", async () => {
			const uri = vscode.Uri.file("/workspace/test.vue");

			await openFile(uri);

			expect(openTextDocumentStub.calledOnce).to.be.true;
			expect(openTextDocumentStub.firstCall.args[0].fsPath).to.equal(uri.fsPath);
		});

		test("should call showTextDocument with document", async () => {
			const uri = vscode.Uri.file("/workspace/test.vue");

			await openFile(uri);

			expect(showTextDocumentStub.calledOnce).to.be.true;
			expect(showTextDocumentStub.firstCall.args[0]).to.equal(mockDocument);
		});

		test("should use default cursor position when not specified", async () => {
			const uri = vscode.Uri.file("/workspace/test.vue");

			await openFile(uri);

			expect(mockEditor.selection).to.not.be.null;
			expect(mockEditor.selection?.start.line).to.equal(0);
			expect(mockEditor.selection?.start.character).to.equal(0);
		});

		test("should use custom cursor position when specified", async () => {
			const uri = vscode.Uri.file("/workspace/test.vue");
			const cursorPosition = new vscode.Position(10, 5);

			await openFile(uri, cursorPosition);

			expect(mockEditor.selection?.start.line).to.equal(10);
			expect(mockEditor.selection?.start.character).to.equal(5);
		});

		test("should set selection as collapsed (start equals end)", async () => {
			const uri = vscode.Uri.file("/workspace/test.vue");
			const cursorPosition = new vscode.Position(5, 3);

			await openFile(uri, cursorPosition);

			expect(mockEditor.selection?.start.line).to.equal(mockEditor.selection?.end.line);
			expect(mockEditor.selection?.start.character).to.equal(mockEditor.selection?.end.character);
		});
	});
});
