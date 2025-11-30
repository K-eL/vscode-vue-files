/**
 * Composable patterns for Vue 3 Composition API
 * @see https://vuejs.org/guide/reusability/composables.html
 */
export enum ComposablePattern {
  /**
   * useState - Simple reactive state management
   * Returns ref with optional initial value
   */
  useState = 'useState',

  /**
   * useFetch - Async data fetching with loading/error states
   * Returns data, loading, error refs and refetch function
   */
  useFetch = 'useFetch',

  /**
   * useEventListener - DOM event listener with automatic cleanup
   * Attaches event on mount, removes on unmount
   */
  useEventListener = 'useEventListener',

  /**
   * custom - Empty composable template
   * Basic structure for custom logic
   */
  custom = 'custom'
}
