import * as Notifications from 'expo-notifications';
import { AppError, ErrorType, errorHandler } from '../utils/ErrorHandler';

export interface INotificationSchedulerService {
  scheduleTaskNotifications(taskId: string, title: string, days: string[], startTime: string, endTime: string): Promise<void>;
  cancelTaskNotifications(taskId: string): Promise<void>;
  cancelAllNotifications(): Promise<void>;
  getScheduledNotifications(): Promise<Notifications.NotificationRequest[]>;
}

export class NotificationSchedulerService implements INotificationSchedulerService {
  private async validateNotificationParams(taskId: string, title: string): Promise<void> {
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

  async scheduleTaskNotifications(
    taskId: string,
    title: string,
    days: string[],
    startTime: string,
    endTime: string
  ): Promise<void> {
    try {
      await this.validateNotificationParams(taskId, title);

      // Cancel existing notifications for this task first
      await this.cancelTaskNotifications(taskId);
      
      // Schedule a confirmation notification
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
      if (!taskId || typeof taskId !== 'string' || taskId.trim() === '') {
        throw new AppError(
          'ID de tarea inválido para cancelar notificaciones',
          ErrorType.VALIDATION,
          'INVALID_TASK_ID_CANCEL',
          { taskId }
        );
      }

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
      
      // Return empty array instead of throwing, as this is often used for cleanup
      return [];
    }
  }
}
