import { AppError, ErrorType } from '../../utils/ErrorHandler';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ITimeValidationService {
  validateTime(time: string): ValidationResult;
  validateTimeRange(startTime: string, endTime: string): ValidationResult;
}

export class TimeValidationService implements ITimeValidationService {
  validateTime(time: string): ValidationResult {
    try {
      if (!time || typeof time !== 'string') {
        return { isValid: false, error: 'La hora es requerida' };
      }

      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(time)) {
        return { isValid: false, error: 'Las horas deben tener formato HH:MM válido (00:00 - 23:59)' };
      }

      return { isValid: true };
    } catch (error) {
      throw new AppError(
        'Error validando formato de hora',
        ErrorType.VALIDATION,
        'TIME_VALIDATION_ERROR',
        { time, originalError: error }
      );
    }
  }

  validateTimeRange(startTime: string, endTime: string): ValidationResult {
    try {
      const startValidation = this.validateTime(startTime);
      if (!startValidation.isValid) {
        return { isValid: false, error: `Hora de inicio inválida: ${startValidation.error}` };
      }

      const endValidation = this.validateTime(endTime);
      if (!endValidation.isValid) {
        return { isValid: false, error: `Hora de fin inválida: ${endValidation.error}` };
      }

      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (startMinutes >= endMinutes) {
        return { 
          isValid: false, 
          error: 'La hora de inicio debe ser anterior a la hora de fin' 
        };
      }

      // Check for reasonable duration (at least 15 minutes)
      if (endMinutes - startMinutes < 15) {
        return { 
          isValid: false, 
          error: 'La tarea debe durar al menos 15 minutos' 
        };
      }

      return { isValid: true };
    } catch (error) {
      throw new AppError(
        'Error validando rango de tiempo',
        ErrorType.VALIDATION,
        'TIME_RANGE_VALIDATION_ERROR',
        { startTime, endTime, originalError: error }
      );
    }
  }
}
