import { NotificationValidationService } from './NotificationValidationService';
import { AppError, ErrorType } from '../utils/ErrorHandler';

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

describe('NotificationValidationService', () => {
  let service: NotificationValidationService;

  beforeEach(() => {
    service = new NotificationValidationService();
    jest.clearAllMocks();
  });

  describe('validateTaskParams', () => {
    it('should not throw for valid parameters', () => {
      expect(() => service.validateTaskParams('valid-task-id', 'Valid Title')).not.toThrow();
    });

    it('should throw AppError for invalid task ID', () => {
      const invalidTaskIds = ['', null, undefined, '   '];
      
      invalidTaskIds.forEach(taskId => {
        expect(() => service.validateTaskParams(taskId as any, 'Valid Title')).toThrow('ID de tarea inválido para notificación');
      });
    });

    it('should throw AppError for non-string task ID', () => {
      const invalidTaskIds = [123, {}, [], true];
      
      invalidTaskIds.forEach(taskId => {
        expect(() => service.validateTaskParams(taskId as any, 'Valid Title')).toThrow('ID de tarea inválido para notificación');
      });
    });

    it('should throw AppError for invalid title', () => {
      const invalidTitles = ['', null, undefined, '   '];
      
      invalidTitles.forEach(title => {
        expect(() => service.validateTaskParams('valid-id', title as any)).toThrow('Título de tarea inválido para notificación');
      });
    });

    it('should throw AppError for non-string title', () => {
      const invalidTitles = [123, {}, [], true];
      
      invalidTitles.forEach(title => {
        expect(() => service.validateTaskParams('valid-id', title as any)).toThrow('Título de tarea inválido para notificación');
      });
    });

    it('should throw AppError with correct error type and code for invalid task ID', () => {
      try {
        service.validateTaskParams('', 'Valid Title');
      } catch (error: any) {
        expect(error.message).toBe('ID de tarea inválido para notificación');
        expect(error.type).toBe('VALIDATION');
        expect(error.code).toBe('INVALID_TASK_ID');
        expect(error.details).toEqual({ taskId: '' });
      }
    });

    it('should throw AppError with correct error type and code for invalid title', () => {
      try {
        service.validateTaskParams('valid-id', '');
      } catch (error: any) {
        expect(error.message).toBe('Título de tarea inválido para notificación');
        expect(error.type).toBe('VALIDATION');
        expect(error.code).toBe('INVALID_TASK_TITLE');
        expect(error.details).toEqual({ title: '', taskId: 'valid-id' });
      }
    });

    it('should handle whitespace-only strings', () => {
      expect(() => service.validateTaskParams('   ', 'Valid Title')).toThrow();
      expect(() => service.validateTaskParams('valid-id', '   ')).toThrow();
    });
  });

  describe('validateTaskId', () => {
    it('should not throw for valid task ID', () => {
      const validTaskIds = ['task-1', 'valid_id', '12345', 'task-with-special-chars'];
      
      validTaskIds.forEach(taskId => {
        expect(() => service.validateTaskId(taskId)).not.toThrow();
      });
    });

    it('should throw AppError for invalid task ID', () => {
      const invalidTaskIds = ['', null, undefined, '   '];
      
      invalidTaskIds.forEach(taskId => {
        expect(() => service.validateTaskId(taskId as any)).toThrow('ID de tarea inválido');
      });
    });

    it('should throw AppError for non-string task ID', () => {
      const invalidTaskIds = [123, {}, [], true, false];
      
      invalidTaskIds.forEach(taskId => {
        expect(() => service.validateTaskId(taskId as any)).toThrow('ID de tarea inválido');
      });
    });

    it('should throw AppError with correct error type and code', () => {
      try {
        service.validateTaskId('');
      } catch (error: any) {
        expect(error.message).toBe('ID de tarea inválido');
        expect(error.type).toBe('VALIDATION');
        expect(error.code).toBe('INVALID_TASK_ID_CANCEL');
        expect(error.details).toEqual({ taskId: '' });
      }
    });

    it('should handle edge cases', () => {
      // Test with various whitespace scenarios
      expect(() => service.validateTaskId(' ')).toThrow();
      expect(() => service.validateTaskId('\t')).toThrow();
      expect(() => service.validateTaskId('\n')).toThrow();
      expect(() => service.validateTaskId('  \t  \n  ')).toThrow();
    });
  });
});
