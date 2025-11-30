/**
 * @fileoverview Sinon setup for mocking
 * Import this in test files that use sinon mocks
 * Note: sinon-chai requires ESM, so we use sinon assertions directly
 */
import * as chai from "chai";
import * as sinon from "sinon";

// Export chai and sinon for convenience
export { chai, sinon };

/**
 * Helper to assert a stub was called
 */
export function assertCalled(stub: sinon.SinonStub, message?: string): void {
  chai.assert.isTrue(stub.called, message || "Expected stub to have been called");
}

/**
/**
 * Helper to assert a stub was called once
 */
export function assertCalledOnce(stub: sinon.SinonStub, message?: string): void {
  chai.assert.isTrue(
    stub.calledOnce,
    message || "Expected stub to have been called once"
  );
}
/**
/**
 * Helper to assert a stub was called with specific arguments
 */
export function assertCalledWith(
  stub: sinon.SinonStub,
  ...args: unknown[]
): void {
  chai.assert.isTrue(stub.calledWith(...args));
}
/**
/**
 * Helper to assert a stub was not called
 */
export function assertNotCalled(stub: sinon.SinonStub, message?: string): void {
  chai.assert.isFalse(stub.called, message || "Expected stub to not have been called");
}
