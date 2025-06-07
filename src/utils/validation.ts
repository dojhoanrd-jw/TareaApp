import { AppError, ErrorType } from './ErrorHandler';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  code?: string;
}

export class ValidationUtils {
  static validateRequired(value: string, fieldName: string): ValidationResult {
    try {
      if (!value || !value.trim()) {
        return {
          isValid: false,
          error: `${fieldName} es obligatorio`,
          code: 'FIELD_REQUIRED'
        };
      }
      return { isValid: true };
    } catch (error) {
      throw new AppError(
        `Error validando campo ${fieldName}`,
        ErrorType.VALIDATION,
        'VALIDATION_ERROR',
        { fieldName, originalError: error }
      );
    }
  }

  static validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
    try {
      if (password !== confirmPassword) {
        return {
          isValid: false,
          error: 'Las contraseñas no coinciden',
          code: 'PASSWORD_MISMATCH'
        };
      }
      return { isValid: true };
    } catch (error) {
      throw new AppError(
        'Error validando coincidencia de contraseñas',
        ErrorType.VALIDATION,
        'PASSWORD_VALIDATION_ERROR',
        { originalError: error }
      );
    }
  }

  static validatePasswordLength(password: string, minLength: number = 6): ValidationResult {
    try {
      if (password.length < minLength) {
        return {
          isValid: false,
          error: `La contraseña debe tener al menos ${minLength} caracteres`,
          code: 'PASSWORD_TOO_SHORT'
        };
      }
      return { isValid: true };
    } catch (error) {
      throw new AppError(
        'Error validando longitud de contraseña',
        ErrorType.VALIDATION,
        'PASSWORD_LENGTH_ERROR',
        { minLength, originalError: error }
      );
    }
  }

  static validateRegistrationForm(
    username: string, 
    password: string, 
    confirmPassword: string
  ): ValidationResult {
    try {
      const usernameValidation = this.validateRequired(username, 'Usuario');
      if (!usernameValidation.isValid) return usernameValidation;

      const passwordValidation = this.validateRequired(password, 'Contraseña');
      if (!passwordValidation.isValid) return passwordValidation;

      const confirmPasswordValidation = this.validateRequired(confirmPassword, 'Confirmar contraseña');
      if (!confirmPasswordValidation.isValid) return confirmPasswordValidation;

      const passwordLengthValidation = this.validatePasswordLength(password);
      if (!passwordLengthValidation.isValid) return passwordLengthValidation;

      return this.validatePasswordMatch(password, confirmPassword);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Error validando formulario de registro',
        ErrorType.VALIDATION,
        'REGISTRATION_VALIDATION_ERROR',
        { username, originalError: error }
      );
    }
  }

  static validatePasswordChangeForm(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): ValidationResult {
    try {
      const currentPasswordValidation = this.validateRequired(currentPassword, 'Contraseña actual');
      if (!currentPasswordValidation.isValid) return currentPasswordValidation;

      const newPasswordValidation = this.validateRequired(newPassword, 'Nueva contraseña');
      if (!newPasswordValidation.isValid) return newPasswordValidation;

      const confirmPasswordValidation = this.validateRequired(confirmPassword, 'Confirmar nueva contraseña');
      if (!confirmPasswordValidation.isValid) return confirmPasswordValidation;

      const passwordLengthValidation = this.validatePasswordLength(newPassword);
      if (!passwordLengthValidation.isValid) return passwordLengthValidation;

      if (currentPassword === newPassword) {
        return {
          isValid: false,
          error: 'La nueva contraseña debe ser diferente a la actual',
          code: 'SAME_PASSWORD'
        };
      }

      return this.validatePasswordMatch(newPassword, confirmPassword);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        'Error validando cambio de contraseña',
        ErrorType.VALIDATION,
        'PASSWORD_CHANGE_VALIDATION_ERROR',
        { originalError: error }
      );
    }
  }
}
