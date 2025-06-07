import { UserValidationService } from './UserValidationService';
import { AppError, ErrorType } from '../utils/ErrorHandler';
import { User } from './UserService';

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

describe('UserValidationService', () => {
  let service: UserValidationService;

  beforeEach(() => {
    service = new UserValidationService();
    jest.clearAllMocks();
  });

  describe('validateUserData', () => {
    it('should not throw for valid user data', () => {
      const validUser: User = { username: 'testuser', password: 'password123' };
      expect(() => service.validateUserData(validUser)).not.toThrow();
    });

    it('should throw AppError for null/undefined user', () => {
      expect(() => service.validateUserData(null as any)).toThrow('Datos de usuario inválidos');
      expect(() => service.validateUserData(undefined as any)).toThrow('Datos de usuario inválidos');
    });

    it('should throw AppError for user without username', () => {
      const invalidUser = { username: '', password: 'password123' } as User;
      expect(() => service.validateUserData(invalidUser)).toThrow('Datos de usuario inválidos');
    });

    it('should throw AppError for user without password', () => {
      const invalidUser = { username: 'testuser', password: '' } as User;
      expect(() => service.validateUserData(invalidUser)).toThrow('Datos de usuario inválidos');
    });

    it('should throw AppError with correct error type and code', () => {
      try {
        service.validateUserData(null as any);
      } catch (error: any) {
        expect(error.message).toBe('Datos de usuario inválidos');
        expect(error.type).toBe('VALIDATION');
        expect(error.code).toBe('INVALID_USER_DATA');
      }
    });
  });

  describe('validateLoginCredentials', () => {
    it('should not throw for valid credentials', () => {
      expect(() => service.validateLoginCredentials('username', 'password')).not.toThrow();
    });

    it('should throw AppError for empty username', () => {
      expect(() => service.validateLoginCredentials('', 'password')).toThrow('Usuario y contraseña son requeridos');
    });

    it('should throw AppError for empty password', () => {
      expect(() => service.validateLoginCredentials('username', '')).toThrow('Usuario y contraseña son requeridos');
    });

    it('should throw AppError for null/undefined credentials', () => {
      expect(() => service.validateLoginCredentials(null as any, 'password')).toThrow('Usuario y contraseña son requeridos');
      expect(() => service.validateLoginCredentials('username', null as any)).toThrow('Usuario y contraseña son requeridos');
      expect(() => service.validateLoginCredentials(undefined as any, undefined as any)).toThrow('Usuario y contraseña son requeridos');
    });

    it('should throw AppError with correct error type and code', () => {
      try {
        service.validateLoginCredentials('', '');
      } catch (error: any) {
        expect(error.message).toBe('Usuario y contraseña son requeridos');
        expect(error.type).toBe('VALIDATION');
        expect(error.code).toBe('MISSING_CREDENTIALS');
      }
    });
  });

  describe('validatePasswordChangeParams', () => {
    const validUser: User = { username: 'testuser', password: 'oldpassword' };

    it('should not throw for valid parameters', () => {
      expect(() => service.validatePasswordChangeParams('oldpass', 'newpass', validUser)).not.toThrow();
    });

    it('should throw AppError for empty current password', () => {
      expect(() => service.validatePasswordChangeParams('', 'newpass', validUser)).toThrow('Parámetros inválidos para cambio de contraseña');
    });

    it('should throw AppError for empty new password', () => {
      expect(() => service.validatePasswordChangeParams('oldpass', '', validUser)).toThrow('Parámetros inválidos para cambio de contraseña');
    });

    it('should throw AppError for null/undefined user', () => {
      expect(() => service.validatePasswordChangeParams('oldpass', 'newpass', null as any)).toThrow('Parámetros inválidos para cambio de contraseña');
      expect(() => service.validatePasswordChangeParams('oldpass', 'newpass', undefined as any)).toThrow('Parámetros inválidos para cambio de contraseña');
    });

    it('should throw AppError when new password equals current password', () => {
      expect(() => service.validatePasswordChangeParams('samepass', 'samepass', validUser)).toThrow('La nueva contraseña debe ser diferente a la actual');
    });

    it('should throw AppError with correct error type and code for same password', () => {
      try {
        service.validatePasswordChangeParams('same', 'same', validUser);
      } catch (error: any) {
        expect(error.message).toBe('La nueva contraseña debe ser diferente a la actual');
        expect(error.type).toBe('VALIDATION');
        expect(error.code).toBe('SAME_PASSWORD');
      }
    });

    it('should throw AppError with correct error type and code for invalid params', () => {
      try {
        service.validatePasswordChangeParams('', '', null as any);
      } catch (error: any) {
        expect(error.message).toBe('Parámetros inválidos para cambio de contraseña');
        expect(error.type).toBe('VALIDATION');
        expect(error.code).toBe('INVALID_PASSWORD_CHANGE_PARAMS');
      }
    });
  });
});
