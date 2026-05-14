import { capitalize, truncateString } from '../src/utils/helpers';

describe('Helper Utils', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should return empty string if input is empty', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('truncateString', () => {
    it('should truncate string if longer than limit', () => {
      expect(truncateString('Hello World', 5)).toBe('Hello...');
    });

    it('should not truncate string if shorter than limit', () => {
      expect(truncateString('Hello', 10)).toBe('Hello');
    });
  });
});
