import { AppError, ErrorType } from '../utils/ErrorHandler';
import { User } from './UserService';

export interface IUserValidationService {
  validateUserData(user: User): void;
  validateLoginCredentials(username: string, password: string): void;
  validatePasswordChangeParams(currentPassword: string, newPassword: string, user: User): void;
}

export class UserValidationService implements IUserValidationService {
  validateUserData(user: User): void {
    if (!user || !user.username || !user.password) {
      throw new AppError(
        'Datos de usuario inválidos',
        ErrorType.VALIDATION,
        'INVALID_USER_DATA',
        { user: { username: user?.username, hasPassword: !!user?.password } }
      );
    }
  }

  validateLoginCredentials(username: string, password: string): void {
    if (!username || !password) {
      throw new AppError(
        'Usuario y contraseña son requeridos',
        ErrorType.VALIDATION,
        'MISSING_CREDENTIALS'
      );
    }
  }

  validatePasswordChangeParams(currentPassword: string, newPassword: string, user: User): void {
    if (!currentPassword || !newPassword || !user) {
      throw new AppError(
        'Parámetros inválidos para cambio de contraseña',
        ErrorType.VALIDATION,
        'INVALID_PASSWORD_CHANGE_PARAMS'
      );
    }

    if (newPassword === currentPassword) {
      throw new AppError(
        'La nueva contraseña debe ser diferente a la actual',
        ErrorType.VALIDATION,
        'SAME_PASSWORD'
      );
    }
  }
}
