/**
 * @fileoverview Barrel export for all interfaces
 * @module interfaces
 */

export type { VueComponentSettings } from "./vue-component-settings";
export type { GeneratorContext } from "./generator-context";
export { createGeneratorContext } from "./generator-context";
export type { CommandDefinition } from "./command-definition";
export type {
	FileCreationResult,
	CreateComposableResult,
	CreatePiniaStoreResult,
	CreateVueComponentResult,
} from "./service-result";
