import { expect } from 'chai';
import { Validation } from '../src/utils/validators';

describe('Validation Tests', () => {
  it('should validate required fields', () => {
    expect(Validation.isRequired('Тестова книга')).to.be.true;
    expect(Validation.isRequired('   ')).to.be.false;
  });

  it('should validate numeric IDs correctly', () => {
    expect(Validation.isValidNumericId('1725533394038')).to.be.true;
    expect(Validation.isValidNumericId('user123')).to.be.false;
  });

  it('should validate publication year', () => {
    expect(Validation.isValidYear('2024')).to.be.true;
    expect(Validation.isValidYear('9999')).to.be.false;
  });
});