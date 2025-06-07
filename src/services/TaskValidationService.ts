import { AppError, ErrorType } from '../utils/ErrorHandler';

export interface ITaskValidationService {
  validateTitle(title: string): { isValid: boolean; error?: string };
  validateDays(days: string[]): { isValid: boolean; error?: string };
  validateTime(time: string): { isValid: boolean; error?: string };
  validateTimeRange(startTime: string, endTime: string): { isValid: boolean; error?: string };
  validateTask(data: { title: string; days: string[]; startTime: string; endTime: string }): { isValid: boolean; error?: string };
}

const VALID_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export class TaskValidationService implements ITaskValidationService {
  validateTitle(title: string): { isValid: boolean; error?: string } {
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

  validateDays(days: string[]): { isValid: boolean; error?: string } {
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

  validateTime(time: string): { isValid: boolean; error?: string } {
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

  validateTimeRange(startTime: string, endTime: string): { isValid: boolean; error?: string } {
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

  validateTask(data: { title: string; days: string[]; startTime: string; endTime: string }): { isValid: boolean; error?: string } {
    try {
      if (!data || typeof data !== 'object') {
        return { isValid: false, error: 'Datos de tarea inválidos' };
      }

      const titleValidation = this.validateTitle(data.title);
      if (!titleValidation.isValid) return titleValidation;

      const daysValidation = this.validateDays(data.days);
      if (!daysValidation.isValid) return daysValidation;

      const timeRangeValidation = this.validateTimeRange(data.startTime, data.endTime);
      if (!timeRangeValidation.isValid) return timeRangeValidation;

      return { isValid: true };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      throw new AppError(
        'Error durante validación completa de tarea',
        ErrorType.VALIDATION,
        'TASK_VALIDATION_ERROR',
        { taskData: data, originalError: error }
      );
    }
  }
}
