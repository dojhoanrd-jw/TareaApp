import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserPersistenceService } from './UserPersistenceService';
import { User } from './UserService';
import { AppError, ErrorType } from '../utils/ErrorHandler';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock ErrorHandler
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
  },
}));

describe('UserPersistenceService', () => {
  let service: UserPersistenceService;
  const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

  beforeEach(() => {
    service = new UserPersistenceService();
    jest.clearAllMocks();
  });

  describe('save', () => {
    const testUser: User = { username: 'testuser', password: 'testpass' };

    it('should save user successfully', async () => {
      mockAsyncStorage.setItem.mockResolvedValueOnce(undefined);

      await expect(service.save(testUser)).resolves.not.toThrow();
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        '@user',
        JSON.stringify(testUser)
      );
    });

    it('should throw AppError when AsyncStorage fails', async () => {
      const storageError = new Error('Storage failed');
      mockAsyncStorage.setItem.mockRejectedValueOnce(storageError);

      await expect(service.save(testUser)).rejects.toThrow('No se pudo guardar el usuario en el almacenamiento');
    });

    it('should log error when save fails', async () => {
      const storageError = new Error('Storage failed');
      mockAsyncStorage.setItem.mockRejectedValueOnce(storageError);

      try {
        await service.save(testUser);
      } catch (error: any) {
        expect(error.message).toBe('No se pudo guardar el usuario en el almacenamiento');
        expect(error.type).toBe('STORAGE');
        expect(error.code).toBe('USER_SAVE_ERROR');
      }
    });
  });

  describe('load', () => {
    it('should return null when no user is stored', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await service.load();
      expect(result).toBeNull();
      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('@user');
    });

    it('should return user when valid data is stored', async () => {
      const testUser: User = { username: 'testuser', password: 'testpass' };
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(testUser));

      const result = await service.load();
      expect(result).toEqual(testUser);
    });

    it('should throw AppError when stored data is corrupted', async () => {
      const corruptedData = { username: 'test' }; // missing password
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(corruptedData));

      // The service catches corrupted data errors and re-throws as generic load error
      await expect(service.load()).rejects.toThrow('No se pudo cargar el usuario del almacenamiento');
    });

    it('should throw AppError when JSON parsing fails', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce('invalid json');

      await expect(service.load()).rejects.toThrow('Los datos del usuario están corruptos');
    });

    it('should throw AppError when AsyncStorage fails', async () => {
      const storageError = new Error('Storage failed');
      mockAsyncStorage.getItem.mockRejectedValueOnce(storageError);

      await expect(service.load()).rejects.toThrow('No se pudo cargar el usuario del almacenamiento');
    });

    it('should handle various corrupted data scenarios', async () => {
      const corruptedDataCases = [
        { data: null, expectedError: 'No se pudo cargar el usuario del almacenamiento' },
        { data: {}, expectedError: 'No se pudo cargar el usuario del almacenamiento' },
        { data: { username: '' }, expectedError: 'No se pudo cargar el usuario del almacenamiento' },
        { data: { password: 'test' }, expectedError: 'No se pudo cargar el usuario del almacenamiento' },
        { data: { username: 'test', password: '' }, expectedError: 'No se pudo cargar el usuario del almacenamiento' },
        { data: 'string', expectedError: 'No se pudo cargar el usuario del almacenamiento' },
        { data: 123, expectedError: 'No se pudo cargar el usuario del almacenamiento' },
        { data: [], expectedError: 'No se pudo cargar el usuario del almacenamiento' }
      ];

      for (const testCase of corruptedDataCases) {
        mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(testCase.data));
        
        await expect(service.load()).rejects.toThrow(testCase.expectedError);
      }
    });

    it('should throw correct error types and codes', async () => {
      // Test JSON parse error
      mockAsyncStorage.getItem.mockResolvedValueOnce('invalid json');
      
      try {
        await service.load();
      } catch (error: any) {
        expect(error.message).toBe('Los datos del usuario están corruptos');
        expect(error.type).toBe('STORAGE');
        expect(error.code).toBe('JSON_PARSE_ERROR');
      }

      // Test corrupted data error - the service catches this and re-throws as generic error
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify({}));
      
      try {
        await service.load();
      } catch (error: any) {
        expect(error.message).toBe('No se pudo cargar el usuario del almacenamiento');
        expect(error.type).toBe('STORAGE');
        expect(error.code).toBe('USER_LOAD_ERROR');
      }

      // Test storage error
      mockAsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage failed'));
      
      try {
        await service.load();
      } catch (error: any) {
        expect(error.message).toBe('No se pudo cargar el usuario del almacenamiento');
        expect(error.type).toBe('STORAGE');
        expect(error.code).toBe('USER_LOAD_ERROR');
      }
    });
  });
});
