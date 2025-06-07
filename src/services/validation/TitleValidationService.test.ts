import { TitleValidationService } from './TitleValidationService';
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

describe('TitleValidationService', () => {
  let service: TitleValidationService;

  beforeEach(() => {
    service = new TitleValidationService();
    jest.clearAllMocks();
  });

  describe('validateTitle', () => {
    it('should return valid for a proper title', () => {
      const result = service.validateTitle('Valid Task Title');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid for empty string', () => {
      const result = service.validateTitle('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El título de la tarea es obligatorio');
    });

    it('should return invalid for null value', () => {
      const result = service.validateTitle(null as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El título de la tarea es obligatorio');
    });

    it('should return invalid for undefined value', () => {
      const result = service.validateTitle(undefined as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El título de la tarea es obligatorio');
    });

    it('should return invalid for non-string value', () => {
      const result = service.validateTitle(123 as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El título de la tarea es obligatorio');
    });

    it('should return invalid for whitespace only', () => {
      const result = service.validateTitle('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El título de la tarea no puede estar vacío');
    });

    it('should return invalid for title exceeding 100 characters', () => {
      const longTitle = 'a'.repeat(101);
      const result = service.validateTitle(longTitle);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El título no puede exceder 100 caracteres');
    });

    it('should return valid for title with exactly 100 characters', () => {
      const maxTitle = 'a'.repeat(100);
      const result = service.validateTitle(maxTitle);
      expect(result.isValid).toBe(true);
    });

    it('should handle special characters correctly', () => {
      const result = service.validateTitle('Tarea con émojis 🚀 y acentos');
      expect(result.isValid).toBe(true);
    });
  });
});
