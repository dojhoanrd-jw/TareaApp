import { AppError, ErrorType } from '../../utils/ErrorHandler';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface IDaysValidationService {
  validateDays(days: string[]): ValidationResult;
}

const VALID_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export class DaysValidationService implements IDaysValidationService {
  validateDays(days: string[]): ValidationResult {
    try {
      if (!Array.isArray(days)) {
        return { isValid: false, error: 'Los días deben ser un arreglo válido' };
      }

      if (days.length === 0) {
        return { isValid: false, error: 'Debes seleccionar al menos un día' };
      }

      const invalidDays = days.filter(day => !VALID_DAYS.includes(day));
      if (invalidDays.length > 0) {
        return { 
          isValid: false, 
          error: `Días inválidos: ${invalidDays.join(', ')}` 
        };
      }

      return { isValid: true };
    } catch (error) {
      throw new AppError(
        'Error validando días de tarea',
        ErrorType.VALIDATION,
        'DAYS_VALIDATION_ERROR',
        { days, originalError: error }
      );
    }
  }
}
