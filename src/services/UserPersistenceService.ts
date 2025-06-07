import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppError, ErrorType, errorHandler } from '../utils/ErrorHandler';
import { User } from './UserService';

export interface IUserPersistenceService {
  save(user: User): Promise<void>;
  load(): Promise<User | null>;
}

export class UserPersistenceService implements IUserPersistenceService {
  private static readonly USER_STORAGE_KEY = '@user';

  async save(user: User): Promise<void> {
    try {
      const userData = JSON.stringify(user);
      await AsyncStorage.setItem(UserPersistenceService.USER_STORAGE_KEY, userData);
    } catch (error) {
      const appError = new AppError(
        'No se pudo guardar el usuario en el almacenamiento',
        ErrorType.STORAGE,
        'USER_SAVE_ERROR',
        { originalError: error, storageKey: UserPersistenceService.USER_STORAGE_KEY }
      );
      
      errorHandler.logError(appError);
      throw appError;
    }
  }

  async load(): Promise<User | null> {
    try {
      const storedUser = await AsyncStorage.getItem(UserPersistenceService.USER_STORAGE_KEY);
      
      if (!storedUser) {
        return null;
      }

      const user = JSON.parse(storedUser);
      
      if (!user || typeof user !== 'object' || !user.username || !user.password) {
        throw new AppError(
          'Datos de usuario corruptos en el almacenamiento',
          ErrorType.STORAGE,
          'CORRUPTED_USER_DATA',
          { storedData: user }
        );
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error instanceof SyntaxError) {
        const appError = new AppError(
          'Los datos del usuario están corruptos',
          ErrorType.STORAGE,
          'JSON_PARSE_ERROR',
          { originalError: error }
        );
        errorHandler.logError(appError);
        throw appError;
      }

      const appError = new AppError(
        'No se pudo cargar el usuario del almacenamiento',
        ErrorType.STORAGE,
        'USER_LOAD_ERROR',
        { originalError: error }
      );
      
      errorHandler.logError(appError);
      throw appError;
    }
  }
}
