import { AppError, ErrorType } from '../../utils/ErrorHandler';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ITitleValidationService {
  validateTitle(title: string): ValidationResult;
}

export class TitleValidationService implements ITitleValidationService {
  validateTitle(title: string): ValidationResult {
    try {
      if (!title || typeof title !== 'string') {
        return { isValid: false, error: 'El título de la tarea es obligatorio' };
      }

      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        return { isValid: false, error: 'El título de la tarea no puede estar vacío' };
      }

      if (trimmedTitle.length > 100) {
        return { isValid: false, error: 'El título no puede exceder 100 caracteres' };
      }

      return { isValid: true };
    } catch (error) {
      throw new AppError(
        'Error validando título de tarea',
        ErrorType.VALIDATION,
        'TITLE_VALIDATION_ERROR',
        { title, originalError: error }
      );
    }
  }
}
