/**
 * @fileoverview Unit tests for PiniaStoreService
 */
import { expect } from "chai";
import * as sinon from "sinon";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { PiniaStoreService } from "../../../../src/services/pinia-store.service";
import { PiniaStoreType } from "../../../../src/enums/pinia-store-type.enum";
import { ConfigHelper } from "../../../../src/helpers/config.helper";

suite("PiniaStoreService", () => {
	let service: PiniaStoreService;
	let mockConfig: sinon.SinonStubbedInstance<ConfigHelper>;
	let tempDir: string;

	setup(() => {
		// Create temp directory for real file tests
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pinia-store-service-test-"));

		// Create mock config
		mockConfig = sinon.createStubInstance(ConfigHelper);

		// Setup pinia config
		const piniaConfig = {
			createInStoresFolder: sinon.stub().returns(true),
			defaultStoreType: sinon.stub().returns("setup"),
			includeExamples: sinon.stub().returns(true),
		};
		(mockConfig as any).pinia = piniaConfig;

		service = new PiniaStoreService(mockConfig as any);
	});

	teardown(() => {
		sinon.restore();
		// Cleanup temp directory
		if (fs.existsSync(tempDir)) {
			fs.rmSync(tempDir, { recursive: true, force: true });
		}
	});

	// ==========================================================================
	// normalizePiniaStoreFileName
	// ==========================================================================

	suite("normalizePiniaStoreFileName", () => {
		test("should add .store suffix to simple name", () => {
			expect(service.normalizePiniaStoreFileName("user")).to.equal("user.store");
		});

		test("should normalize name to lowercase", () => {
			expect(service.normalizePiniaStoreFileName("User")).to.equal("user.store");
		});

		test("should not duplicate .store suffix", () => {
			expect(service.normalizePiniaStoreFileName("user.store")).to.equal("user.store");
		});

		test("should trim whitespace", () => {
			expect(service.normalizePiniaStoreFileName("  user  ")).to.equal("user.store");
		});

		test("should handle mixed case .store suffix", () => {
			expect(service.normalizePiniaStoreFileName("user.STORE")).to.equal("user.store");
		});
	});

	// ==========================================================================
	// normalizePiniaStoreName
	// ==========================================================================

	suite("normalizePiniaStoreName", () => {
		test("should return lowercase name", () => {
			expect(service.normalizePiniaStoreName("User")).to.equal("user");
		});

		test("should remove .store suffix", () => {
			expect(service.normalizePiniaStoreName("user.store")).to.equal("user");
		});

		test("should trim whitespace", () => {
			expect(service.normalizePiniaStoreName("  user  ")).to.equal("user");
		});
	});

	// ==========================================================================
	// validateName
	// ==========================================================================

	suite("validateName", () => {
		test("should return error for empty name", () => {
			expect(service.validateName("")).to.equal("Store name is required");
		});

		test("should return error for whitespace-only name", () => {
			expect(service.validateName("   ")).to.equal("Store name is required");
		});

		test("should return error for name starting with number", () => {
			const result = service.validateName("123user");
			expect(result).to.include("must start with a letter");
		});

		test("should return undefined for valid name", () => {
			expect(service.validateName("user")).to.be.undefined;
		});

		test("should return undefined for name with .store suffix", () => {
			expect(service.validateName("user.store")).to.be.undefined;
		});

		test("should accept hyphens", () => {
			expect(service.validateName("user-auth")).to.be.undefined;
		});

		test("should accept underscores", () => {
			expect(service.validateName("user_auth")).to.be.undefined;
		});

		test("should reject special characters", () => {
			const result = service.validateName("user@auth");
			expect(result).to.include("alphanumeric");
		});
	});

	// ==========================================================================
	// create - success cases
	// ==========================================================================

	suite("create", () => {
		test("should create TypeScript setup store file", async () => {
			const result = await service.create({
				name: "user",
				storeType: PiniaStoreType.setup,
				targetDirectory: tempDir,
				useTypeScript: true,
			});

			expect(result.success).to.be.true;
			expect(result.fileName).to.equal("user.store.ts");
			expect(result.filePath).to.equal(path.join(tempDir, "user.store.ts"));
			expect(fs.existsSync(result.filePath!)).to.be.true;
		});

		test("should create JavaScript store file", async () => {
			const result = await service.create({
				name: "user",
				storeType: PiniaStoreType.setup,
				targetDirectory: tempDir,
				useTypeScript: false,
			});

			expect(result.success).to.be.true;
			expect(result.fileName).to.equal("user.store.js");
		});

		test("should generate setup store content", async () => {
			const result = await service.create({
				name: "counter",
				storeType: PiniaStoreType.setup,
				targetDirectory: tempDir,
			});

			const content = fs.readFileSync(result.filePath!, "utf8");
			expect(content).to.include("defineStore");
			expect(content).to.include("ref(");
		});

		test("should generate options store content", async () => {
			const result = await service.create({
				name: "counter",
				storeType: PiniaStoreType.options,
				targetDirectory: tempDir,
			});

			const content = fs.readFileSync(result.filePath!, "utf8");
			expect(content).to.include("defineStore");
			expect(content).to.include("state:");
		});

		test("should create subdirectory if it doesn't exist", async () => {
			const subDir = path.join(tempDir, "stores");

			const result = await service.create({
				name: "user",
				storeType: PiniaStoreType.setup,
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
			const fileName = "user.store.ts";
			fs.writeFileSync(path.join(tempDir, fileName), "existing content");

			const result = await service.create({
				name: "user",
				storeType: PiniaStoreType.setup,
				targetDirectory: tempDir,
			});

			expect(result.success).to.be.false;
			expect(result.fileExisted).to.be.true;
			expect(result.error).to.include("already exists");
		});

		test("should overwrite file if overwriteExisting is true", async () => {
			// Create file first
			const fileName = "user.store.ts";
			fs.writeFileSync(path.join(tempDir, fileName), "old content");

			const result = await service.create({
				name: "user",
				storeType: PiniaStoreType.setup,
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
		test("should return correct options when createInStoresFolder is true", () => {
			(mockConfig as any).pinia.createInStoresFolder.returns(true);

			const options = service.getTargetDirectoryOptions();

			expect(options.createSubdirectory).to.be.true;
			expect(options.subdirectoryName).to.equal("stores");
			expect(options.subdirectoryAliases).to.deep.equal(["store"]);
		});

		test("should return correct options when createInStoresFolder is false", () => {
			(mockConfig as any).pinia.createInStoresFolder.returns(false);

			const options = service.getTargetDirectoryOptions();

			expect(options.createSubdirectory).to.be.false;
		});
	});
});
