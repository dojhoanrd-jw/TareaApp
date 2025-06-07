import * as Notifications from 'expo-notifications';
import { AppError, ErrorType, errorHandler } from '../utils/ErrorHandler';
import { NotificationValidationService, INotificationValidationService } from './NotificationValidationService';

export interface INotificationSchedulerService {
  scheduleTaskNotifications(taskId: string, title: string, days: string[], startTime: string, endTime: string): Promise<void>;
  cancelTaskNotifications(taskId: string): Promise<void>;
  cancelAllNotifications(): Promise<void>;
  getScheduledNotifications(): Promise<Notifications.NotificationRequest[]>;
}

export class NotificationSchedulerService implements INotificationSchedulerService {
  private validationService: INotificationValidationService;

  constructor() {
    this.validationService = new NotificationValidationService();
  }

  async scheduleTaskNotifications(
    taskId: string,
    title: string,
    days: string[],
    startTime: string,
    endTime: string
  ): Promise<void> {
    try {
      this.validationService.validateTaskParams(taskId, title);

      await this.cancelTaskNotifications(taskId);
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        identifier: `${taskId}-scheduled`,
        content: {
          title: '✅ Tarea programada',
          body: `La tarea "${title.trim()}" ha sido configurada`,
          data: { 
            taskId, 
            type: 'scheduled', 
            title: title.trim(),
            days,
            startTime,
            endTime
          },
        },
        trigger: null,
      });

      if (__DEV__) {
        console.log(`Notification scheduled successfully for task: ${title} (ID: ${notificationId})`);
      }
    } catch (error) {
      if (error instanceof AppError) {
        errorHandler.logError(error);
        throw error;
      }

      const appError = new AppError(
        'No se pudieron programar las notificaciones para la tarea',
        ErrorType.NOTIFICATION,
        'SCHEDULE_NOTIFICATION_ERROR',
        { taskId, title, days, startTime, endTime, originalError: error }
      );
      
      errorHandler.logError(appError);
      throw appError;
    }
  }

  async cancelTaskNotifications(taskId: string): Promise<void> {
    try {
      this.validationService.validateTaskId(taskId);

      const scheduledNotifications = await this.getScheduledNotifications();
      const taskNotifications = scheduledNotifications.filter(
        (notification) => notification.identifier.startsWith(taskId)
      );

      const cancelPromises = taskNotifications.map(notification => 
        Notifications.cancelScheduledNotificationAsync(notification.identifier)
      );

      await Promise.all(cancelPromises);

      if (__DEV__ && taskNotifications.length > 0) {
        console.log(`Cancelled ${taskNotifications.length} notifications for task: ${taskId}`);
      }
    } catch (error) {
      if (error instanceof AppError) {
        errorHandler.logError(error);
        throw error;
      }

      const appError = new AppError(
        'No se pudieron cancelar las notificaciones de la tarea',
        ErrorType.NOTIFICATION,
        'CANCEL_TASK_NOTIFICATIONS_ERROR',
        { taskId, originalError: error }
      );
      
      errorHandler.logError(appError);
      throw appError;
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      if (__DEV__) {
        console.log('All notifications cancelled successfully');
      }
    } catch (error) {
      const appError = new AppError(
        'No se pudieron cancelar todas las notificaciones',
        ErrorType.NOTIFICATION,
        'CANCEL_ALL_NOTIFICATIONS_ERROR',
        { originalError: error }
      );
      
      errorHandler.logError(appError);
      throw appError;
    }
  }

  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      return notifications || [];
    } catch (error) {
      const appError = new AppError(
        'No se pudieron obtener las notificaciones programadas',
        ErrorType.NOTIFICATION,
        'GET_NOTIFICATIONS_ERROR',
        { originalError: error }
      );
      
      errorHandler.logError(appError);
      return [];
    }
  }
}
