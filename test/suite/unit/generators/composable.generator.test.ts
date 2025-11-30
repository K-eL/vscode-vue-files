import { expect } from 'chai';
import { generateComposable } from '../../../../src/generators/composable.generator';
import { ComposablePattern } from '../../../../src/enums/composable-pattern.enum';

suite('Composable Generator', () => {
  suite('Name formatting', () => {
    test('should add use prefix if not present', () => {
      const result = generateComposable({
        name: 'counter',
        pattern: ComposablePattern.custom
      });

      expect(result).to.include('export function useCounter');
    });

    test('should keep use prefix if already present', () => {
      const result = generateComposable({
        name: 'useCounter',
        pattern: ComposablePattern.custom
      });

      expect(result).to.include('export function useCounter');
      expect(result).not.to.include('useUseCounter');
    });

    test('should handle kebab-case names', () => {
      const result = generateComposable({
        name: 'my-state',
        pattern: ComposablePattern.custom
      });

      expect(result).to.include('export function useMyState');
    });
  });

  suite('useState pattern', () => {
    test('should generate useState with TypeScript generics', () => {
      const result = generateComposable({
        name: 'state',
        pattern: ComposablePattern.useState,
        useGenerics: true
      });

      expect(result).to.include('export function useState<T>');
      expect(result).to.include('initialValue: T');
      expect(result).to.include('Ref<T>');
      expect(result).to.include('const state = ref(initialValue)');
    });

    test('should generate useState without TypeScript generics', () => {
      const result = generateComposable({
        name: 'state',
        pattern: ComposablePattern.useState,
        useGenerics: false
      });

      expect(result).not.to.include('<T>');
      expect(result).to.include('export function useState(initialValue)');
    });
  });

  suite('useFetch pattern', () => {
    test('should generate useFetch with loading and error states', () => {
      const result = generateComposable({
        name: 'fetch',
        pattern: ComposablePattern.useFetch,
        useGenerics: true
      });

      expect(result).to.include('export function useFetch<T');
      expect(result).to.include('const data = ref');
      expect(result).to.include('const error = ref');
      expect(result).to.include('const isLoading = ref');
      expect(result).to.include('async function execute()');
      expect(result).to.include('return {');
      expect(result).to.include('data,');
      expect(result).to.include('error,');
      expect(result).to.include('isLoading,');
      expect(result).to.include('execute');
    });

    test('should generate useFetch interface in TypeScript mode', () => {
      const result = generateComposable({
        name: 'api',
        pattern: ComposablePattern.useFetch,
        useGenerics: true
      });

      expect(result).to.include('export interface ApiReturn<T>');
      expect(result).to.include('data: Ref<T | null>');
      expect(result).to.include('error: Ref<Error | null>');
      expect(result).to.include('isLoading: Ref<boolean>');
    });
  });

  suite('useEventListener pattern', () => {
    test('should generate useEventListener with cleanup', () => {
      const result = generateComposable({
        name: 'eventListener',
        pattern: ComposablePattern.useEventListener
      });

      expect(result).to.include('export function useEventListener');
      expect(result).to.include('addEventListener');
      expect(result).to.include('removeEventListener');
      expect(result).to.include('onMounted');
      expect(result).to.include('onUnmounted');
    });

    test('should include proper TypeScript types when useGenerics is true', () => {
      const result = generateComposable({
        name: 'click',
        pattern: ComposablePattern.useEventListener,
        useGenerics: true
      });

      expect(result).to.include('keyof WindowEventMap');
      expect(result).to.include('MaybeRef<T>');
      expect(result).to.include('type MaybeRef<T> = T | Ref<T>');
      expect(result).to.include('handler: (event: WindowEventMap[K]) => void');
    });

    test('should generate JavaScript version without types when useGenerics is false', () => {
      const result = generateComposable({
        name: 'click',
        pattern: ComposablePattern.useEventListener,
        useGenerics: false
      });

      expect(result).not.to.include('keyof WindowEventMap');
      expect(result).not.to.include('MaybeRef<T>');
      expect(result).not.to.include('type ');
      expect(result).to.include('export function useClick(target, event, handler, options)');
      expect(result).to.include("import { onMounted, onUnmounted, unref } from 'vue'");
    });
  });

  suite('custom pattern', () => {
    test('should generate basic composable structure with TypeScript', () => {
      const result = generateComposable({
        name: 'myComposable',
        pattern: ComposablePattern.custom,
        useGenerics: true
      });

      expect(result).to.include('export function useMyComposable');
      expect(result).to.include("import { shallowRef, computed, onMounted, onUnmounted, type ShallowRef } from 'vue'");
      expect(result).to.include('const state: ShallowRef<T | null> = shallowRef');
      expect(result).to.include('const computedValue = computed');
      expect(result).to.include('function updateState');
      expect(result).to.include('onMounted');
      expect(result).to.include('onUnmounted');
      expect(result).to.include('return {');
    });

    test('should generate JavaScript version without types when useGenerics is false', () => {
      const result = generateComposable({
        name: 'myComposable',
        pattern: ComposablePattern.custom,
        useGenerics: false
      });

      expect(result).to.include('export function useMyComposable(initialValue = null)');
      expect(result).to.include("import { shallowRef, computed, onMounted, onUnmounted } from 'vue'");
      expect(result).not.to.include('type ShallowRef');
      expect(result).not.to.include('<T');
      expect(result).to.include('const state = shallowRef(initialValue)');
      expect(result).to.include('function updateState(newValue)');
    });
  });

  suite('useFetch pattern JavaScript', () => {
    test('should generate useFetch without TypeScript types', () => {
      const result = generateComposable({
        name: 'api',
        pattern: ComposablePattern.useFetch,
        useGenerics: false
      });

      expect(result).not.to.include('interface');
      expect(result).not.to.include('<T');
      expect(result).to.include('export function useApi(url, options)');
      expect(result).to.include('const data = ref(null)');
      expect(result).to.include('error.value = e');
    });
  });
});
