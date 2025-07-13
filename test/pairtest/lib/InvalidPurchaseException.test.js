import InvalidPurchaseException from '../../../src/pairtest/lib/InvalidPurchaseException.js';

describe('InvalidPurchaseException', () => {

  test('creates new instance of the Error class', () => {
    const exception = new InvalidPurchaseException('Test message');
    expect(exception).toBeInstanceOf(Error);
    expect(exception).toBeInstanceOf(InvalidPurchaseException);
  });

  test('sets provided error message', () => {
    const exceptionMessage = 'Custom error message';
    const exception = new InvalidPurchaseException(exceptionMessage);
    expect(exception.message).toBe(exceptionMessage);
  });

  test('has InvalidPurchaseException name property', () => {
    const exception = new InvalidPurchaseException('Test message');
    expect(exception.name).toBe('InvalidPurchaseException');
  });

  test('can be thrown and caught', () => {
    const exceptionMessage = 'Too many tickets requested';
    expect(() => {
      throw new InvalidPurchaseException(exceptionMessage);
    }).toThrow(InvalidPurchaseException);
    
    expect(() => {
      throw new InvalidPurchaseException(exceptionMessage);
    }).toThrow(exceptionMessage);
  });
}); 