import { AppError, ErrorType, errorHandler } from '../utils/ErrorHandler';
import { User } from './UserService';
import { IUserPersistenceService } from './UserPersistenceService';
import { IUserValidationService } from './UserValidationService';

export interface IUserAuthenticationService {
  validateLogin(username: string, password: string): Promise<User>;
  updatePassword(currentPassword: string, newPassword: string, user: User): Promise<User>;
}

export class UserAuthenticationService implements IUserAuthenticationService {
  constructor(
    private persistenceService: IUserPersistenceService,
    private validationService: IUserValidationService
  ) {}

  async validateLogin(username: string, password: string): Promise<User> {
    try {
      this.validationService.validateLoginCredentials(username, password);

      const storedUser = await this.persistenceService.load();
      
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

  async updatePassword(currentPassword: string, newPassword: string, user: User): Promise<User> {
    try {
      this.validationService.validatePasswordChangeParams(currentPassword, newPassword, user);

      if (currentPassword !== user.password) {
        throw new AppError(
          'La contraseña actual es incorrecta',
          ErrorType.AUTHENTICATION,
          'INCORRECT_CURRENT_PASSWORD'
        );
      }

      const updatedUser = { ...user, password: newPassword };
      await this.persistenceService.save(updatedUser);
      
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
