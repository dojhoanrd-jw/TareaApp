import { TimeValidationService } from './TimeValidationService';
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

describe('TimeValidationService', () => {
  let service: TimeValidationService;

  beforeEach(() => {
    service = new TimeValidationService();
    jest.clearAllMocks();
  });

  describe('validateTime', () => {
    it('should return valid for proper time format', () => {
      const validTimes = ['09:30', '23:59', '00:00', '12:45'];
      validTimes.forEach(time => {
        const result = service.validateTime(time);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should return invalid for empty or null time', () => {
      const invalidTimes = ['', null, undefined];
      invalidTimes.forEach(time => {
        const result = service.validateTime(time as any);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('La hora es requerida');
      });
    });

    it('should return invalid for non-string values', () => {
      const result = service.validateTime(123 as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('La hora es requerida');
    });

    it('should return invalid for malformed time strings', () => {
      const invalidTimes = ['25:00', '12:60', '12:5', 'abc', '12:ab', '99:99'];
      invalidTimes.forEach(time => {
        const result = service.validateTime(time);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Las horas deben tener formato HH:MM válido (00:00 - 23:59)');
      });
    });

    it('should accept single digit hour formats as valid', () => {
      // Based on the regex /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, these should be valid
      const validSingleDigitTimes = ['9:30', '1:45'];
      validSingleDigitTimes.forEach(time => {
        const result = service.validateTime(time);
        expect(result.isValid).toBe(true);
      });
    });

    it('should handle edge cases for valid times', () => {
      const edgeCases = ['00:01', '23:58', '12:00'];
      edgeCases.forEach(time => {
        const result = service.validateTime(time);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('validateTimeRange', () => {
    it('should return valid for proper time range', () => {
      const result = service.validateTimeRange('09:00', '17:00');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid when start time is invalid', () => {
      const result = service.validateTimeRange('25:00', '17:00');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Hora de inicio inválida');
    });

    it('should return invalid when end time is invalid', () => {
      const result = service.validateTimeRange('09:00', '25:00');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Hora de fin inválida');
    });

    it('should return invalid when start time equals end time', () => {
      const result = service.validateTimeRange('12:00', '12:00');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('La hora de inicio debe ser anterior a la hora de fin');
    });

    it('should return invalid when start time is after end time', () => {
      const result = service.validateTimeRange('18:00', '09:00');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('La hora de inicio debe ser anterior a la hora de fin');
    });

    it('should return invalid for duration less than 15 minutes', () => {
      const result = service.validateTimeRange('12:00', '12:10');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('La tarea debe durar al menos 15 minutos');
    });

    it('should return valid for exactly 15 minutes duration', () => {
      const result = service.validateTimeRange('12:00', '12:15');
      expect(result.isValid).toBe(true);
    });

    it('should handle cross-midnight scenarios correctly', () => {
      const result = service.validateTimeRange('23:00', '01:00');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('La hora de inicio debe ser anterior a la hora de fin');
    });
  });
});
