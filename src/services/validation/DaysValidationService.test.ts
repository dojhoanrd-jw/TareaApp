import { DaysValidationService } from './DaysValidationService';
import { AppError, ErrorType } from '../../utils/ErrorHandler';

// Mock the ErrorHandler to avoid actual logging during tests
jest.mock('../../utils/ErrorHandler', () => ({
  AppError: jest.fn().mockImplementation((message, type, code, details) => {
    const error = new Error(message);
    error.name = 'AppError';
    (error as any).type = type;
    (error as any).code = code;
    (error as any).details = details;
    return error;
  }),
  ErrorType: {
    VALIDATION: 'VALIDATION',
    NETWORK: 'NETWORK',
    STORAGE: 'STORAGE',
    AUTHENTICATION: 'AUTHENTICATION',
    NOTIFICATION: 'NOTIFICATION',
    TASK: 'TASK',
    UNKNOWN: 'UNKNOWN'
  },
  errorHandler: {
    logError: jest.fn(),
    handleError: jest.fn(),
  }
}));

describe('DaysValidationService', () => {
  let service: DaysValidationService;

  beforeEach(() => {
    service = new DaysValidationService();
    jest.clearAllMocks();
  });

  describe('validateDays', () => {
    it('should return valid for proper days array', () => {
      const validDaysArrays = [
        ['monday'],
        ['monday', 'tuesday'],
        ['sunday', 'saturday'],
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      ];

      validDaysArrays.forEach(days => {
        const result = service.validateDays(days);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should return invalid for non-array input', () => {
      const invalidInputs = [null, undefined, 'string', 123, {}, true];
      
      invalidInputs.forEach(input => {
        const result = service.validateDays(input as any);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Los días deben ser un arreglo válido');
      });
    });

    it('should return invalid for empty array', () => {
      const result = service.validateDays([]);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Debes seleccionar al menos un día');
    });

    it('should return invalid for array with invalid days', () => {
      const invalidDaysArrays = [
        ['invalidDay'],
        ['monday', 'invalidDay'],
        ['MONDAY'], // case sensitive
        ['mon', 'tue'], // abbreviated forms
        ['lunes'], // Spanish names
        ['1', '2'] // numeric values
      ];

      invalidDaysArrays.forEach(days => {
        const result = service.validateDays(days);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('Días inválidos:');
      });
    });

    it('should handle mixed valid and invalid days', () => {
      const result = service.validateDays(['monday', 'invalidDay', 'tuesday', 'anotherInvalid']);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Días inválidos: invalidDay, anotherInvalid');
    });

    it('should accept all valid days of the week', () => {
      const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const result = service.validateDays(allDays);
      expect(result.isValid).toBe(true);
    });

    it('should handle duplicate days', () => {
      const result = service.validateDays(['monday', 'monday', 'tuesday']);
      expect(result.isValid).toBe(true); // Duplicates are allowed, business logic should handle them
    });

    it('should throw AppError on unexpected error', () => {
      // Create a spy on Array.isArray and make it throw
      const isArraySpy = jest.spyOn(Array, 'isArray').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      expect(() => service.validateDays(['monday'])).toThrow('Error validando días de tarea');
      expect(() => service.validateDays(['monday'])).toThrow(Error);

      // Restore the spy
      isArraySpy.mockRestore();
    });
  });
});
