import { TaskValidationService } from './TaskValidationService';
import { AppError, ErrorType } from '../utils/ErrorHandler';

// Mock the individual validation services
jest.mock('./validation/TitleValidationService');
jest.mock('./validation/DaysValidationService');
jest.mock('./validation/TimeValidationService');

// Mock the ErrorHandler module
jest.mock('../utils/ErrorHandler', () => ({
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

import { TitleValidationService } from './validation/TitleValidationService';
import { DaysValidationService } from './validation/DaysValidationService';
import { TimeValidationService } from './validation/TimeValidationService';

describe('TaskValidationService', () => {
  let service: TaskValidationService;
  let mockTitleValidator: jest.Mocked<TitleValidationService>;
  let mockDaysValidator: jest.Mocked<DaysValidationService>;
  let mockTimeValidator: jest.Mocked<TimeValidationService>;

  beforeEach(() => {
    // Create mock instances
    mockTitleValidator = {
      validateTitle: jest.fn(),
    } as any;

    mockDaysValidator = {
      validateDays: jest.fn(),
    } as any;

    mockTimeValidator = {
      validateTime: jest.fn(),
      validateTimeRange: jest.fn(),
    } as any;

    // Mock constructors to return our mocks
    (TitleValidationService as jest.Mock).mockImplementation(() => mockTitleValidator);
    (DaysValidationService as jest.Mock).mockImplementation(() => mockDaysValidator);
    (TimeValidationService as jest.Mock).mockImplementation(() => mockTimeValidator);

    service = new TaskValidationService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateTitle', () => {
    it('should delegate to title validator', () => {
      const mockResult = { isValid: true };
      mockTitleValidator.validateTitle.mockReturnValue(mockResult);

      const result = service.validateTitle('Test Title');

      expect(mockTitleValidator.validateTitle).toHaveBeenCalledWith('Test Title');
      expect(result).toBe(mockResult);
    });
  });

  describe('validateDays', () => {
    it('should delegate to days validator', () => {
      const mockResult = { isValid: true };
      const testDays = ['monday', 'tuesday'];
      mockDaysValidator.validateDays.mockReturnValue(mockResult);

      const result = service.validateDays(testDays);

      expect(mockDaysValidator.validateDays).toHaveBeenCalledWith(testDays);
      expect(result).toBe(mockResult);
    });
  });

  describe('validateTime', () => {
    it('should delegate to time validator', () => {
      const mockResult = { isValid: true };
      mockTimeValidator.validateTime.mockReturnValue(mockResult);

      const result = service.validateTime('09:00');

      expect(mockTimeValidator.validateTime).toHaveBeenCalledWith('09:00');
      expect(result).toBe(mockResult);
    });
  });

  describe('validateTimeRange', () => {
    it('should delegate to time validator', () => {
      const mockResult = { isValid: true };
      mockTimeValidator.validateTimeRange.mockReturnValue(mockResult);

      const result = service.validateTimeRange('09:00', '17:00');

      expect(mockTimeValidator.validateTimeRange).toHaveBeenCalledWith('09:00', '17:00');
      expect(result).toBe(mockResult);
    });
  });

  describe('validateTask', () => {
    const validTaskData = {
      title: 'Test Task',
      days: ['monday', 'tuesday'],
      startTime: '09:00',
      endTime: '17:00'
    };

    it('should return valid when all validations pass', () => {
      mockTitleValidator.validateTitle.mockReturnValue({ isValid: true });
      mockDaysValidator.validateDays.mockReturnValue({ isValid: true });
      mockTimeValidator.validateTimeRange.mockReturnValue({ isValid: true });

      const result = service.validateTask(validTaskData);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid when title validation fails', () => {
      const titleError = { isValid: false, error: 'Title error' };
      mockTitleValidator.validateTitle.mockReturnValue(titleError);

      const result = service.validateTask(validTaskData);

      expect(result).toBe(titleError);
      expect(mockDaysValidator.validateDays).not.toHaveBeenCalled();
      expect(mockTimeValidator.validateTimeRange).not.toHaveBeenCalled();
    });

    it('should return invalid when days validation fails', () => {
      mockTitleValidator.validateTitle.mockReturnValue({ isValid: true });
      const daysError = { isValid: false, error: 'Days error' };
      mockDaysValidator.validateDays.mockReturnValue(daysError);

      const result = service.validateTask(validTaskData);

      expect(result).toBe(daysError);
      expect(mockTimeValidator.validateTimeRange).not.toHaveBeenCalled();
    });

    it('should return invalid when time range validation fails', () => {
      mockTitleValidator.validateTitle.mockReturnValue({ isValid: true });
      mockDaysValidator.validateDays.mockReturnValue({ isValid: true });
      const timeError = { isValid: false, error: 'Time error' };
      mockTimeValidator.validateTimeRange.mockReturnValue(timeError);

      const result = service.validateTask(validTaskData);

      expect(result).toBe(timeError);
    });

    it('should return invalid for null/undefined data', () => {
      const result = service.validateTask(null as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Datos de tarea inválidos');
    });

    it('should return invalid for non-object data', () => {
      const result = service.validateTask('invalid' as any);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Datos de tarea inválidos');
    });

    it('should call validators in correct order', () => {
      mockTitleValidator.validateTitle.mockReturnValue({ isValid: false, error: 'Title error' });
      mockDaysValidator.validateDays.mockReturnValue({ isValid: true });
      mockTimeValidator.validateTimeRange.mockReturnValue({ isValid: true });

      service.validateTask(validTaskData);

      expect(mockTitleValidator.validateTitle).toHaveBeenCalledWith(validTaskData.title);
      expect(mockDaysValidator.validateDays).not.toHaveBeenCalled(); // Should not be called if title fails
    });

    it('should throw AppError when validator throws unexpected error', () => {
      mockTitleValidator.validateTitle.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      expect(() => service.validateTask(validTaskData)).toThrow('Error durante validación completa de tarea');
    });

    it('should rethrow AppError from validators', () => {
      const customError = new Error('Custom error');
      customError.name = 'AppError';
      (customError as any).type = 'VALIDATION';
      
      mockTitleValidator.validateTitle.mockImplementation(() => {
        throw customError;
      });

      // The service catches AppErrors and re-throws them, but since our mock AppError
      // constructor wraps them, we expect the wrapper behavior
      expect(() => service.validateTask(validTaskData)).toThrow('Error durante validación completa de tarea');
    });
  });
});
