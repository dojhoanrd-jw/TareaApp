export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class ValidationUtils {
  static validateRequired(value: string, fieldName: string): ValidationResult {
    if (!value || !value.trim()) {
      return {
        isValid: false,
        error: `${fieldName} es obligatorio`
      };
    }
    return { isValid: true };
  }

  static validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
    if (password !== confirmPassword) {
      return {
        isValid: false,
        error: 'Las contraseñas no coinciden'
      };
    }
    return { isValid: true };
  }

  static validatePasswordLength(password: string, minLength: number = 6): ValidationResult {
    if (password.length < minLength) {
      return {
        isValid: false,
        error: `La contraseña debe tener al menos ${minLength} caracteres`
      };
    }
    return { isValid: true };
  }

  static validateRegistrationForm(
    username: string, 
    password: string, 
    confirmPassword: string
  ): ValidationResult {
    const usernameValidation = this.validateRequired(username, 'Usuario');
    if (!usernameValidation.isValid) return usernameValidation;

    const passwordValidation = this.validateRequired(password, 'Contraseña');
    if (!passwordValidation.isValid) return passwordValidation;

    const confirmPasswordValidation = this.validateRequired(confirmPassword, 'Confirmar contraseña');
    if (!confirmPasswordValidation.isValid) return confirmPasswordValidation;

    const passwordLengthValidation = this.validatePasswordLength(password);
    if (!passwordLengthValidation.isValid) return passwordLengthValidation;

    return this.validatePasswordMatch(password, confirmPassword);
  }

  static validatePasswordChangeForm(
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): ValidationResult {
    const currentPasswordValidation = this.validateRequired(currentPassword, 'Contraseña actual');
    if (!currentPasswordValidation.isValid) return currentPasswordValidation;

    const newPasswordValidation = this.validateRequired(newPassword, 'Nueva contraseña');
    if (!newPasswordValidation.isValid) return newPasswordValidation;

    const confirmPasswordValidation = this.validateRequired(confirmPassword, 'Confirmar nueva contraseña');
    if (!confirmPasswordValidation.isValid) return confirmPasswordValidation;

    const passwordLengthValidation = this.validatePasswordLength(newPassword);
    if (!passwordLengthValidation.isValid) return passwordLengthValidation;

    return this.validatePasswordMatch(newPassword, confirmPassword);
  }
}
