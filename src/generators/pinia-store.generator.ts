import { PiniaStoreType } from '../enums/pinia-store-type.enum';

/**
 * Configuration for Pinia store generation
 */
export interface PiniaStoreConfig {
  /** Store name (will be converted to useXxxStore format) */
  name: string;
  /** Store style: options or setup */
  type: PiniaStoreType;
  /** Include example state */
  includeExampleState?: boolean;
  /** Include example getter */
  includeExampleGetter?: boolean;
  /** Include example action */
  includeExampleAction?: boolean;
}

/**
 * Generates Pinia store content based on configuration
 * @see https://pinia.vuejs.org/core-concepts/
 */
export function generatePiniaStore(config: PiniaStoreConfig): string {
  const { name, type, includeExampleState = true, includeExampleGetter = true, includeExampleAction = true } = config;

  // Convert name to proper store naming convention
  // user -> useUserStore, UserProfile -> useUserProfileStore
  const storeName = toStoreNameFormat(name);
  const storeId = toStoreIdFormat(name);

  if (type === PiniaStoreType.setup) {
    return generateSetupStore(storeName, storeId, { includeExampleState, includeExampleGetter, includeExampleAction });
  }

  return generateOptionsStore(storeName, storeId, { includeExampleState, includeExampleGetter, includeExampleAction });
}

/**
 * Converts a name to the store function name format (useXxxStore)
 * @example "user" -> "useUserStore"
 * @example "userProfile" -> "useUserProfileStore"
 * @example "UserProfile" -> "useUserProfileStore"
 */
function toStoreNameFormat(name: string): string {
  // Remove common suffixes if present
  let cleanName = name.replace(/\.store(\.ts)?$/i, '').replace(/Store$/i, '');
  
  // Capitalize first letter
  cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  
  return `use${cleanName}Store`;
}

/**
 * Converts a name to the store ID format (kebab-case)
 * @example "userProfile" -> "user-profile"
 * @example "UserProfile" -> "user-profile"
 */
function toStoreIdFormat(name: string): string {
  // Remove common suffixes
  const cleanName = name.replace(/\.store(\.ts)?$/i, '').replace(/Store$/i, '');
  
  // Convert camelCase/PascalCase to kebab-case
  return cleanName
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

interface StoreOptions {
  includeExampleState: boolean;
  includeExampleGetter: boolean;
  includeExampleAction: boolean;
}

/**
 * Generates Options Store syntax
 * @see https://pinia.vuejs.org/core-concepts/#option-stores
 */
function generateOptionsStore(storeName: string, storeId: string, options: StoreOptions): string {
  const { includeExampleState, includeExampleGetter, includeExampleAction } = options;

  const stateContent = includeExampleState
    ? `
    state: () => ({
      count: 0,
      // Add your state properties here
    }),`
    : `
    state: () => ({
      // Add your state properties here
    }),`;

  const gettersContent = includeExampleGetter
    ? `
    getters: {
      doubleCount: (state) => state.count * 2,
      // Add your getters here
    },`
    : `
    getters: {
      // Add your getters here
    },`;

  const actionsContent = includeExampleAction
    ? `
    actions: {
      increment() {
        this.count++;
      },
      // Add your actions here
    },`
    : `
    actions: {
      // Add your actions here
    },`;

  return `import { defineStore } from 'pinia';

export const ${storeName} = defineStore('${storeId}', {${stateContent}${gettersContent}${actionsContent}
});
`;
}

/**
 * Generates Setup Store syntax (Composition API style)
 * @see https://pinia.vuejs.org/core-concepts/#setup-stores
 */
function generateSetupStore(storeName: string, storeId: string, options: StoreOptions): string {
  const { includeExampleState, includeExampleGetter, includeExampleAction } = options;

  const imports: string[] = [];
  const body: string[] = [];
  const returns: string[] = [];

  if (includeExampleState || includeExampleGetter) {
    imports.push('ref');
  }
  if (includeExampleGetter) {
    imports.push('computed');
  }

  if (includeExampleState) {
    body.push(`  // State
  const count = ref(0);
  // Add your state refs here`);
    returns.push('count');
  } else {
    body.push(`  // State
  // const myState = ref(initialValue);`);
  }

  if (includeExampleGetter) {
    body.push(`
  // Getters
  const doubleCount = computed(() => count.value * 2);
  // Add your computed getters here`);
    returns.push('doubleCount');
  } else {
    body.push(`
  // Getters
  // const myGetter = computed(() => myState.value);`);
  }

  if (includeExampleAction) {
    body.push(`
  // Actions
  function increment() {
    count.value++;
  }
  // Add your action functions here`);
    returns.push('increment');
  } else {
    body.push(`
  // Actions
  // function myAction() { }
`);
  }

  const vueImports = imports.length > 0 ? `import { ${imports.join(', ')} } from 'vue';\n` : '';
  const returnStatement = returns.length > 0
    ? `\n  return { ${returns.join(', ')} };`
    : `\n  return { /* export your state, getters, actions here */ };`;

  return `${vueImports}import { defineStore } from 'pinia';

export const ${storeName} = defineStore('${storeId}', () => {
${body.join('\n')}
${returnStatement}
});
`;
}
