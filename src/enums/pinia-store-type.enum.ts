/**
 * Pinia store styles
 * @see https://pinia.vuejs.org/core-concepts/#option-stores
 * @see https://pinia.vuejs.org/core-concepts/#setup-stores
 */
export enum PiniaStoreType {
  /**
   * Options Store - Similar to Vue Options API
   * Uses defineStore with state, getters, actions objects
   */
  options = 'options',

  /**
   * Setup Store - Similar to Vue Composition API
   * Uses defineStore with setup function returning refs and functions
   */
  setup = 'setup'
}
