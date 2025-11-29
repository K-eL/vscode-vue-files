import { expect } from "chai";
import * as sinon from "sinon";
import * as vscode from "vscode";
import { requestStringDialog } from "../../../../src/helpers/input-dialog.helper";
import { mockShowInputBox } from "../../../__helpers__";

suite("Input Dialog Helper", () => {
	let sandbox: sinon.SinonSandbox;

	setup(() => {
		sandbox = sinon.createSandbox();
	});

	teardown(() => {
		sandbox.restore();
	});

	suite("requestStringDialog", () => {
		test("should return trimmed user input when valid", async () => {
			mockShowInputBox(sandbox, "  MyComponent  ");

			const result = await requestStringDialog(
				"Enter component name",
				"e.g., MyComponent",
			);

			expect(result).to.equal("MyComponent");
		});

		test("should return undefined when user cancels", async () => {
			mockShowInputBox(sandbox, undefined);

			const result = await requestStringDialog(
				"Enter component name",
				"e.g., MyComponent",
			);

			expect(result).to.be.undefined;
		});

		test("should call showInputBox with correct parameters", async () => {
			const inputStub = mockShowInputBox(sandbox, "TestName");

			await requestStringDialog("Test prompt", "Test placeholder");

			expect(inputStub.calledOnce).to.be.true;
			const options = inputStub.firstCall.args[0];
			expect(options.prompt).to.equal("Test prompt");
			expect(options.placeHolder).to.equal("Test placeholder");
			expect(options).to.have.property("validateInput");
		});

		test("should have validateInput function that validates file names", async () => {
			const inputStub = mockShowInputBox(sandbox, undefined);

			await requestStringDialog("Enter name", "placeholder");

			const validateInput = inputStub.firstCall.args[0].validateInput;

			// Valid file names
			expect(validateInput("MyComponent")).to.be.null;
			expect(validateInput("my-component")).to.be.null;
			expect(validateInput("my_component")).to.be.null;
			expect(validateInput("my.component")).to.be.null;
			expect(validateInput("My Component")).to.be.null;
			expect(validateInput("component123")).to.be.null;

			// Invalid file names (special characters)
			expect(validateInput("<script>")).to.equal("Invalid input");
			expect(validateInput("file/name")).to.equal("Invalid input");
			expect(validateInput("file\\name")).to.equal("Invalid input");
			expect(validateInput("file:name")).to.equal("Invalid input");
			expect(validateInput("file*name")).to.equal("Invalid input");
			expect(validateInput("file?name")).to.equal("Invalid input");
			expect(validateInput('file"name')).to.equal("Invalid input");
			expect(validateInput("file|name")).to.equal("Invalid input");
		});

		test("should return empty string if input is empty after trim", async () => {
			mockShowInputBox(sandbox, "   ");

			const result = await requestStringDialog("Enter name", "placeholder");

			expect(result).to.equal("");
		});
	});
});
