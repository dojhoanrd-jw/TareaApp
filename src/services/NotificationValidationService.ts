import { AppError, ErrorType } from '../utils/ErrorHandler';

export interface INotificationValidationService {
  validateTaskParams(taskId: string, title: string): void;
  validateTaskId(taskId: string): void;
}

export class NotificationValidationService implements INotificationValidationService {
  validateTaskParams(taskId: string, title: string): void {
    if (!taskId || typeof taskId !== 'string' || taskId.trim() === '') {
      throw new AppError(
        'ID de tarea inválido para notificación',
        ErrorType.VALIDATION,
        'INVALID_TASK_ID',
        { taskId }
      );
    }

    if (!title || typeof title !== 'string' || title.trim() === '') {
      throw new AppError(
        'Título de tarea inválido para notificación',
        ErrorType.VALIDATION,
        'INVALID_TASK_TITLE',
        { title, taskId }
      );
    }
  }

  validateTaskId(taskId: string): void {
    if (!taskId || typeof taskId !== 'string' || taskId.trim() === '') {
      throw new AppError(
        'ID de tarea inválido',
        ErrorType.VALIDATION,
        'INVALID_TASK_ID_CANCEL',
        { taskId }
      );
    }
  }
}
