import { ComposablePattern } from '../enums/composable-pattern.enum';

/**
 * Configuration for composable generation
 */
export interface ComposableConfig {
  /** Composable name (will be prefixed with 'use' if not already) */
  name: string;
  /** Composable pattern to use */
  pattern: ComposablePattern;
  /** Whether to use TypeScript generics */
  useGenerics?: boolean;
}

/**
 * Generates Vue 3 composable content based on configuration
 * @see https://vuejs.org/guide/reusability/composables.html
 */
export function generateComposable(config: ComposableConfig): string {
  const { name, pattern, useGenerics = true } = config;

  // Ensure name starts with 'use'
  const composableName = toComposableNameFormat(name);

  switch (pattern) {
    case ComposablePattern.useState:
      return generateUseStateComposable(composableName, useGenerics);
    case ComposablePattern.useFetch:
      return generateUseFetchComposable(composableName, useGenerics);
    case ComposablePattern.useEventListener:
      return generateUseEventListenerComposable(composableName, useGenerics);
    case ComposablePattern.custom:
    default:
      return generateCustomComposable(composableName, useGenerics);
  }
}

/**
 * Converts a name to the composable function name format (useXxx)
 * @example "counter" -> "useCounter"
 * @example "useCounter" -> "useCounter"
 * @example "my-state" -> "useMyState"
 */
function toComposableNameFormat(name: string): string {
  // Remove file extension if present
  let cleanName = name.replace(/\.(ts|js)$/i, '');

  // If already starts with 'use', return as is (with proper casing)
  if (cleanName.toLowerCase().startsWith('use')) {
    return 'use' + cleanName.slice(3).charAt(0).toUpperCase() + cleanName.slice(4);
  }

  // Convert kebab-case or snake_case to camelCase
  cleanName = cleanName
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/[-_]/g, '');

  // Capitalize first letter and add 'use' prefix
  return 'use' + cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
}

/**
 * Generates useState pattern composable
 * Simple reactive state management
 */
function generateUseStateComposable(name: string, useGenerics: boolean): string {
  if (useGenerics) {
    return `import { ref, type Ref } from 'vue';

/**
 * ${name} - Simple reactive state management
 * @param initialValue - Initial value for the state
 * @returns Reactive ref containing the state
 */
export function ${name}<T>(initialValue: T): Ref<T> {
  const state = ref(initialValue) as Ref<T>;

  return state;
}
`;
  }

  return `import { ref } from 'vue';

/**
 * ${name} - Simple reactive state management
 * @param initialValue - Initial value for the state
 * @returns Reactive ref containing the state
 */
export function ${name}(initialValue) {
  const state = ref(initialValue);

  return state;
}
`;
}

/**
 * Generates useFetch pattern composable
 * Async data fetching with loading/error states
 */
function generateUseFetchComposable(name: string, useGenerics: boolean): string {
  if (useGenerics) {
    return `import { ref, type Ref } from 'vue';

export interface ${name.replace(/^use/, '')}Return<T> {
  data: Ref<T | null>;
  error: Ref<Error | null>;
  isLoading: Ref<boolean>;
  execute: () => Promise<void>;
}

/**
 * ${name} - Async data fetching with loading and error states
 * @param url - The URL to fetch data from
 * @param options - Optional fetch options
 * @returns Object with data, error, isLoading refs and execute function
 */
export function ${name}<T = unknown>(
  url: string | Ref<string>,
  options?: RequestInit
): ${name.replace(/^use/, '')}Return<T> {
  const data = ref<T | null>(null) as Ref<T | null>;
  const error = ref<Error | null>(null);
  const isLoading = ref(false);

  async function execute(): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      const targetUrl = typeof url === 'string' ? url : url.value;
      const response = await fetch(targetUrl, options);

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }

      data.value = await response.json();
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
    } finally {
      isLoading.value = false;
    }
  }

  // Execute immediately
  execute();

  return {
    data,
    error,
    isLoading,
    execute
  };
}
`;
  }

  return `import { ref } from 'vue';

/**
 * ${name} - Async data fetching with loading and error states
 * @param url - The URL to fetch data from
 * @param options - Optional fetch options
 * @returns Object with data, error, isLoading refs and execute function
 */
export function ${name}(url, options) {
  const data = ref(null);
  const error = ref(null);
  const isLoading = ref(false);

  async function execute() {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }

      data.value = await response.json();
    } catch (e) {
      error.value = e;
    } finally {
      isLoading.value = false;
    }
  }

  // Execute immediately
  execute();

  return {
    data,
    error,
    isLoading,
    execute
  };
}
`;
}

/**
 * Generates useEventListener pattern composable
 * DOM event listener with automatic cleanup
 */
function generateUseEventListenerComposable(name: string, useGenerics: boolean): string {
  if (useGenerics) {
    return `import { onMounted, onUnmounted, type Ref, unref } from 'vue';

type MaybeRef<T> = T | Ref<T>;
type EventTarget = Window | Document | HTMLElement;

/**
 * ${name} - DOM event listener with automatic cleanup
 * Attaches event listener on mount, removes on unmount
 * @param target - The event target (window, document, or element)
 * @param event - The event name to listen for
 * @param handler - The event handler function
 * @param options - Optional event listener options
 */
export function ${name}<K extends keyof WindowEventMap>(
  target: MaybeRef<EventTarget | null | undefined>,
  event: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): void {
  let cleanup: (() => void) | undefined;

  function setup(): void {
    const el = unref(target);
    if (!el) return;

    el.addEventListener(event, handler as EventListener, options);
    
    cleanup = () => {
      el.removeEventListener(event, handler as EventListener, options);
    };
  }

  onMounted(() => {
    setup();
  });

  onUnmounted(() => {
    cleanup?.();
  });
}
`;
  }

  return `import { onMounted, onUnmounted, unref } from 'vue';

/**
 * ${name} - DOM event listener with automatic cleanup
 * Attaches event listener on mount, removes on unmount
 * @param target - The event target (window, document, or element)
 * @param event - The event name to listen for
 * @param handler - The event handler function
 * @param options - Optional event listener options
 */
export function ${name}(target, event, handler, options) {
  let cleanup;

  function setup() {
    const el = unref(target);
    if (!el) return;

    el.addEventListener(event, handler, options);
    
    cleanup = () => {
      el.removeEventListener(event, handler, options);
    };
  }

  onMounted(() => {
    setup();
  });

  onUnmounted(() => {
    cleanup?.();
  });
}
`;
}

/**
 * Generates custom/empty composable template
 */
function generateCustomComposable(name: string, useGenerics: boolean): string {
  if (useGenerics) {
    return `import { shallowRef, computed, onMounted, onUnmounted, type ShallowRef } from 'vue';

/**
 * ${name} - Custom composable
 * @description Add your composable description here
 */
export function ${name}<T = unknown>(initialValue: T | null = null) {
  // State (using shallowRef to preserve type T)
  const state: ShallowRef<T | null> = shallowRef(initialValue);

  // Computed
  const computedValue = computed(() => {
    return state.value;
  });

  // Methods
  function updateState(newValue: T | null): void {
    state.value = newValue;
  }

  // Lifecycle
  onMounted(() => {
    // Setup logic here
  });

  onUnmounted(() => {
    // Cleanup logic here
  });

  // Return public API
  return {
    state,
    computedValue,
    updateState
  };
}
`;
  }

  return `import { shallowRef, computed, onMounted, onUnmounted } from 'vue';

/**
 * ${name} - Custom composable
 * @description Add your composable description here
 */
export function ${name}(initialValue = null) {
  // State
  const state = shallowRef(initialValue);

  // Computed
  const computedValue = computed(() => {
    return state.value;
  });

  // Methods
  function updateState(newValue) {
    state.value = newValue;
  }

  // Lifecycle
  onMounted(() => {
    // Setup logic here
  });

  onUnmounted(() => {
    // Cleanup logic here
  });

  // Return public API
  return {
    state,
    computedValue,
    updateState
  };
}
`;
}