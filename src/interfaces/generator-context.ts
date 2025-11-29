import { ConfigHelper } from "../helpers/config.helper";

/**
 * Context object passed to generator functions.
 * Encapsulates all dependencies needed for code generation,
 * eliminating the need for global/module-level state.
 *
 * @example
 * ```typescript
 * const ctx: GeneratorContext = {
 *   isTs: true,
 *   config: ConfigHelper.getInstance(),
 *   ind: ConfigHelper.getInstance().ind,
 * };
 *
 * const script = generateCompositionApiScriptTemplate(ctx);
 * ```
 */
export interface GeneratorContext {
	/**
	 * Whether to generate TypeScript code.
	 * - `true`: Include type annotations and generics
	 * - `false`: Generate plain JavaScript
	 */
	isTs: boolean;

	/**
	 * Configuration helper instance for accessing extension settings.
	 * Provides access to user preferences for code generation.
	 */
	config: ConfigHelper;

	/**
	 * Indentation function based on editor settings.
	 * Returns the appropriate indentation string (tabs or spaces).
	 *
	 * @param level - Number of indentation levels (default: 1)
	 * @returns Indentation string
	 */
	ind: (level?: number) => string;
}

/**
 * Creates a GeneratorContext from the current configuration.
 *
 * @param isTs - Whether to generate TypeScript code
 * @param config - ConfigHelper instance (defaults to singleton)
 * @returns GeneratorContext ready for use in generators
 *
 * @example
 * ```typescript
 * const ctx = createGeneratorContext(true);
 * const script = generateCompositionApiScriptTemplate(ctx);
 * ```
 */
export function createGeneratorContext(
	isTs: boolean,
	config: ConfigHelper = ConfigHelper.getInstance(),
): GeneratorContext {
	return {
		isTs,
		config,
		ind: config.ind,
	};
}
