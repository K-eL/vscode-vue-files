import { expect } from 'chai';
import { generatePiniaStore } from '../../../src/generators/pinia-store.generator';
import { PiniaStoreType } from '../../../src/enums/pinia-store-type.enum';

suite('Pinia Store Generator', () => {
  suite('Setup Store', () => {
    test('should generate a setup store with correct name format', () => {
      const result = generatePiniaStore({
        name: 'user',
        type: PiniaStoreType.setup,
        includeExampleState: true,
        includeExampleGetter: true,
        includeExampleAction: true
      });

      expect(result).to.include('export const useUserStore');
      expect(result).to.include("defineStore('user'");
      expect(result).to.include("import { ref, computed } from 'vue'");
    });

    test('should generate state with ref', () => {
      const result = generatePiniaStore({
        name: 'counter',
        type: PiniaStoreType.setup,
        includeExampleState: true,
        includeExampleGetter: false,
        includeExampleAction: false
      });

      expect(result).to.include('const count = ref(0)');
      expect(result).to.include('return { count }');
    });

    test('should generate getters with computed', () => {
      const result = generatePiniaStore({
        name: 'counter',
        type: PiniaStoreType.setup,
        includeExampleState: true,
        includeExampleGetter: true,
        includeExampleAction: false
      });

      expect(result).to.include('const doubleCount = computed');
      expect(result).to.include('count.value * 2');
    });

    test('should generate actions as functions', () => {
      const result = generatePiniaStore({
        name: 'counter',
        type: PiniaStoreType.setup,
        includeExampleState: true,
        includeExampleGetter: false,
        includeExampleAction: true
      });

      expect(result).to.include('function increment()');
      expect(result).to.include('count.value++');
    });

    test('should handle PascalCase names', () => {
      const result = generatePiniaStore({
        name: 'UserProfile',
        type: PiniaStoreType.setup
      });

      expect(result).to.include('export const useUserProfileStore');
      expect(result).to.include("defineStore('user-profile'");
    });

    test('should handle names with Store suffix', () => {
      const result = generatePiniaStore({
        name: 'userStore',
        type: PiniaStoreType.setup
      });

      expect(result).to.include('export const useUserStore');
      expect(result).not.to.include('useUserStoreStore');
    });
  });

  suite('Options Store', () => {
    test('should generate an options store with correct structure', () => {
      const result = generatePiniaStore({
        name: 'cart',
        type: PiniaStoreType.options,
        includeExampleState: true,
        includeExampleGetter: true,
        includeExampleAction: true
      });

      expect(result).to.include('export const useCartStore');
      expect(result).to.include("defineStore('cart'");
      expect(result).to.include('state: () => ({');
      expect(result).to.include('getters: {');
      expect(result).to.include('actions: {');
    });

    test('should generate state with return object', () => {
      const result = generatePiniaStore({
        name: 'counter',
        type: PiniaStoreType.options,
        includeExampleState: true
      });

      expect(result).to.include('state: () => ({');
      expect(result).to.include('count: 0');
    });

    test('should generate getters with state parameter', () => {
      const result = generatePiniaStore({
        name: 'counter',
        type: PiniaStoreType.options,
        includeExampleGetter: true
      });

      expect(result).to.include('doubleCount: (state) => state.count * 2');
    });

    test('should generate actions with this context', () => {
      const result = generatePiniaStore({
        name: 'counter',
        type: PiniaStoreType.options,
        includeExampleAction: true
      });

      expect(result).to.include('increment()');
      expect(result).to.include('this.count++');
    });

    test('should not include vue imports for options store', () => {
      const result = generatePiniaStore({
        name: 'test',
        type: PiniaStoreType.options,
        includeExampleState: false,
        includeExampleGetter: false,
        includeExampleAction: false
      });

      expect(result).not.to.include("from 'vue'");
      expect(result).to.include("import { defineStore } from 'pinia'");
    });
  });

  suite('Store ID formatting', () => {
    test('should convert camelCase to kebab-case for store ID', () => {
      const result = generatePiniaStore({
        name: 'userProfile',
        type: PiniaStoreType.setup
      });

      expect(result).to.include("defineStore('user-profile'");
    });

    test('should convert PascalCase to kebab-case for store ID', () => {
      const result = generatePiniaStore({
        name: 'ShoppingCart',
        type: PiniaStoreType.setup
      });

      expect(result).to.include("defineStore('shopping-cart'");
    });

    test('should handle simple lowercase names', () => {
      const result = generatePiniaStore({
        name: 'auth',
        type: PiniaStoreType.setup
      });

      expect(result).to.include("defineStore('auth'");
    });
  });
});
