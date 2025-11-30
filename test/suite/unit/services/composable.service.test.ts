/**
 * @fileoverview Unit tests for ComposableService
 */
import { expect } from "chai";
import * as sinon from "sinon";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { ComposableService } from "../../../../src/services/composable.service";
import { ComposablePattern } from "../../../../src/enums/composable-pattern.enum";
import { ConfigHelper } from "../../../../src/helpers/config.helper";

suite("ComposableService", () => {
	let service: ComposableService;
	let mockConfig: sinon.SinonStubbedInstance<ConfigHelper>;
	let tempDir: string;

	setup(() => {
		// Create temp directory for real file tests
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "composable-service-test-"));

		// Create mock config
		mockConfig = sinon.createStubInstance(ConfigHelper);

		// Setup composables config
		const composablesConfig = {
			useTypeScript: sinon.stub().returns(true),
			createInComposablesFolder: sinon.stub().returns(true),
		};
		(mockConfig as any).composables = composablesConfig;

		service = new ComposableService(mockConfig as any);
	});

	teardown(() => {
		sinon.restore();
		// Cleanup temp directory
		if (fs.existsSync(tempDir)) {
			fs.rmSync(tempDir, { recursive: true, force: true });
		}
	});

	// ==========================================================================
	// normalizeComposableName
	// ==========================================================================

	suite("normalizeComposableName", () => {
		test("should add 'use' prefix to simple name", () => {
			expect(service.normalizeComposableName("counter")).to.equal("useCounter");
		});

		test("should preserve existing 'use' prefix with proper casing", () => {
			expect(service.normalizeComposableName("useCounter")).to.equal("useCounter");
		});

		test("should fix lowercase 'use' prefix", () => {
			expect(service.normalizeComposableName("usecounter")).to.equal("useCounter");
		});

		test("should handle UPPERCASE input", () => {
			expect(service.normalizeComposableName("USECOUNTER")).to.equal("useCOUNTER");
		});

		test("should trim whitespace", () => {
			expect(service.normalizeComposableName("  counter  ")).to.equal("useCounter");
		});

		test("should capitalize first letter after 'use'", () => {
			expect(service.normalizeComposableName("UseMyHook")).to.equal("useMyHook");
		});
	});

	// ==========================================================================
	// validateName
	// ==========================================================================

	suite("validateName", () => {
		test("should return error for empty name", () => {
			expect(service.validateName("")).to.equal("Composable name is required");
		});

		test("should return error for whitespace-only name", () => {
			expect(service.validateName("   ")).to.equal("Composable name is required");
		});

		test("should return error for name starting with number", () => {
			const result = service.validateName("123counter");
			expect(result).to.include("must start with a letter");
		});

		test("should return undefined for valid name", () => {
			expect(service.validateName("counter")).to.be.undefined;
		});

		test("should return undefined for valid name with 'use' prefix", () => {
			expect(service.validateName("useCounter")).to.be.undefined;
		});

		test("should return undefined for alphanumeric names", () => {
			expect(service.validateName("useCounter123")).to.be.undefined;
		});

		test("should return error for names with special characters", () => {
			const result = service.validateName("counter-hook");
			expect(result).to.include("alphanumeric");
		});
	});

	// ==========================================================================
	// create - success cases
	// ==========================================================================

	suite("create", () => {
		test("should create TypeScript composable file", async () => {
			const result = await service.create({
				name: "counter",
				pattern: ComposablePattern.useState,
				targetDirectory: tempDir,
			});

			expect(result.success).to.be.true;
			expect(result.fileName).to.equal("useCounter.ts");
			expect(result.filePath).to.equal(path.join(tempDir, "useCounter.ts"));
			expect(fs.existsSync(result.filePath!)).to.be.true;
		});

		test("should create JavaScript composable when TypeScript is disabled", async () => {
			(mockConfig as any).composables.useTypeScript.returns(false);

			const result = await service.create({
				name: "counter",
				pattern: ComposablePattern.useState,
				targetDirectory: tempDir,
			});

			expect(result.success).to.be.true;
			expect(result.fileName).to.equal("useCounter.js");
		});

		test("should generate content with useState pattern", async () => {
			const result = await service.create({
				name: "counter",
				pattern: ComposablePattern.useState,
				targetDirectory: tempDir,
			});

			const content = fs.readFileSync(result.filePath!, "utf8");
			expect(content).to.include("ref");
		});

		test("should generate content with useFetch pattern", async () => {
			const result = await service.create({
				name: "data",
				pattern: ComposablePattern.useFetch,
				targetDirectory: tempDir,
			});

			const content = fs.readFileSync(result.filePath!, "utf8");
			expect(content).to.include("fetch");
		});

		test("should create subdirectory if it doesn't exist", async () => {
			const subDir = path.join(tempDir, "composables");

			const result = await service.create({
				name: "counter",
				pattern: ComposablePattern.useState,
				targetDirectory: subDir,
			});

			expect(result.success).to.be.true;
			expect(fs.existsSync(subDir)).to.be.true;
		});
	});

	// ==========================================================================
	// create - error cases
	// ==========================================================================

	suite("create - error handling", () => {
		test("should return error if file already exists", async () => {
			// Create file first
			const fileName = "useCounter.ts";
			fs.writeFileSync(path.join(tempDir, fileName), "existing content");

			const result = await service.create({
				name: "counter",
				pattern: ComposablePattern.useState,
				targetDirectory: tempDir,
			});

			expect(result.success).to.be.false;
			expect(result.fileExisted).to.be.true;
			expect(result.error).to.include("already exists");
		});

		test("should overwrite file if overwriteExisting is true", async () => {
			// Create file first
			const fileName = "useCounter.ts";
			fs.writeFileSync(path.join(tempDir, fileName), "old content");

			const result = await service.create({
				name: "counter",
				pattern: ComposablePattern.useState,
				targetDirectory: tempDir,
				overwriteExisting: true,
			});

			expect(result.success).to.be.true;
			const content = fs.readFileSync(result.filePath!, "utf8");
			expect(content).to.not.equal("old content");
		});
	});

	// ==========================================================================
	// getTargetDirectoryOptions
	// ==========================================================================

	suite("getTargetDirectoryOptions", () => {
		test("should return correct options when createInComposablesFolder is true", () => {
			(mockConfig as any).composables.createInComposablesFolder.returns(true);

			const options = service.getTargetDirectoryOptions();

			expect(options.createSubdirectory).to.be.true;
			expect(options.subdirectoryName).to.equal("composables");
			expect(options.subdirectoryAliases).to.deep.equal(["composable"]);
		});

		test("should return correct options when createInComposablesFolder is false", () => {
			(mockConfig as any).composables.createInComposablesFolder.returns(false);

			const options = service.getTargetDirectoryOptions();

			expect(options.createSubdirectory).to.be.false;
		});
	});
});
