import { AppError, ErrorType } from '../utils/ErrorHandler';
import { TitleValidationService, ITitleValidationService } from './validation/TitleValidationService';
import { DaysValidationService, IDaysValidationService } from './validation/DaysValidationService';
import { TimeValidationService, ITimeValidationService } from './validation/TimeValidationService';

export interface ITaskValidationService {
  validateTitle(title: string): { isValid: boolean; error?: string };
  validateDays(days: string[]): { isValid: boolean; error?: string };
  validateTime(time: string): { isValid: boolean; error?: string };
  validateTimeRange(startTime: string, endTime: string): { isValid: boolean; error?: string };
  validateTask(data: { title: string; days: string[]; startTime: string; endTime: string }): { isValid: boolean; error?: string };
}

export class TaskValidationService implements ITaskValidationService {
  private titleValidator: ITitleValidationService;
  private daysValidator: IDaysValidationService;
  private timeValidator: ITimeValidationService;

  constructor() {
    this.titleValidator = new TitleValidationService();
    this.daysValidator = new DaysValidationService();
    this.timeValidator = new TimeValidationService();
  }

  validateTitle(title: string): { isValid: boolean; error?: string } {
    return this.titleValidator.validateTitle(title);
  }

  validateDays(days: string[]): { isValid: boolean; error?: string } {
    return this.daysValidator.validateDays(days);
  }

  validateTime(time: string): { isValid: boolean; error?: string } {
    return this.timeValidator.validateTime(time);
  }

  validateTimeRange(startTime: string, endTime: string): { isValid: boolean; error?: string } {
    return this.timeValidator.validateTimeRange(startTime, endTime);
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
