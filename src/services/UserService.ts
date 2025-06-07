import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppError, ErrorType, errorHandler } from '../utils/ErrorHandler';

export interface User {
  username: string;
  password: string;
}

class UserService {
  private static readonly USER_STORAGE_KEY = '@user';

  static async saveUser(user: User): Promise<void> {
    try {
      if (!user || !user.username || !user.password) {
        throw new AppError(
          'Datos de usuario inválidos',
          ErrorType.VALIDATION,
          'INVALID_USER_DATA',
          { user: { username: user?.username, hasPassword: !!user?.password } }
        );
      }

      const userData = JSON.stringify(user);
      await AsyncStorage.setItem(this.USER_STORAGE_KEY, userData);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      const appError = new AppError(
        'No se pudo guardar el usuario en el almacenamiento',
        ErrorType.STORAGE,
        'USER_SAVE_ERROR',
        { originalError: error, storageKey: this.USER_STORAGE_KEY }
      );
      
      errorHandler.logError(appError);
      throw appError;
    }
  }

  static async getUser(): Promise<User | null> {
    try {
      const storedUser = await AsyncStorage.getItem(this.USER_STORAGE_KEY);
      
      if (!storedUser) {
        return null;
      }

      const user = JSON.parse(storedUser);
      
      // Validate user structure
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

  static async validateLogin(username: string, password: string): Promise<User> {
    try {
      if (!username || !password) {
        throw new AppError(
          'Usuario y contraseña son requeridos',
          ErrorType.VALIDATION,
          'MISSING_CREDENTIALS'
        );
      }

      const storedUser = await this.getUser();
      
      if (!storedUser) {
        throw new AppError(
          'No hay usuario registrado en este dispositivo',
          ErrorType.AUTHENTICATION,
          'NO_USER_REGISTERED'
        );
      }

      if (storedUser.username !== username || storedUser.password !== password) {
        throw new AppError(
          'Usuario o contraseña incorrectos',
          ErrorType.AUTHENTICATION,
          'INVALID_CREDENTIALS',
          { attemptedUsername: username }
        );
      }

      return storedUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      const appError = new AppError(
        'Error durante la validación de login',
        ErrorType.AUTHENTICATION,
        'LOGIN_VALIDATION_ERROR',
        { username, originalError: error }
      );
      
      errorHandler.logError(appError);
      throw appError;
    }
  }

  static async updatePassword(currentPassword: string, newPassword: string, user: User): Promise<User> {
    try {
      if (!currentPassword || !newPassword || !user) {
        throw new AppError(
          'Parámetros inválidos para cambio de contraseña',
          ErrorType.VALIDATION,
          'INVALID_PASSWORD_CHANGE_PARAMS'
        );
      }

      if (currentPassword !== user.password) {
        throw new AppError(
          'La contraseña actual es incorrecta',
          ErrorType.AUTHENTICATION,
          'INCORRECT_CURRENT_PASSWORD'
        );
      }

      if (newPassword === currentPassword) {
        throw new AppError(
          'La nueva contraseña debe ser diferente a la actual',
          ErrorType.VALIDATION,
          'SAME_PASSWORD'
        );
      }

      const updatedUser = { ...user, password: newPassword };
      await this.saveUser(updatedUser);
      
      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      const appError = new AppError(
        'Error al actualizar la contraseña',
        ErrorType.AUTHENTICATION,
        'PASSWORD_UPDATE_ERROR',
        { username: user?.username, originalError: error }
      );
      
      errorHandler.logError(appError);
      throw appError;
    }
  }
}

export default UserService;
