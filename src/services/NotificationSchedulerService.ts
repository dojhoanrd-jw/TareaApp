import * as Notifications from 'expo-notifications';

export interface INotificationSchedulerService {
  scheduleTaskNotifications(taskId: string, title: string, days: string[], startTime: string, endTime: string): Promise<void>;
  cancelTaskNotifications(taskId: string): Promise<void>;
  cancelAllNotifications(): Promise<void>;
  getScheduledNotifications(): Promise<Notifications.NotificationRequest[]>;
}

export class NotificationSchedulerService implements INotificationSchedulerService {
  async scheduleTaskNotifications(
    taskId: string,
    title: string,
    days: string[],
    startTime: string,
    endTime: string
  ): Promise<void> {
    try {
      if (!taskId || !title) {
        console.warn('Invalid notification parameters');
        return;
      }

      // Cancel existing notifications for this task
      await this.cancelTaskNotifications(taskId);
      
      // Schedule a confirmation notification
      await Notifications.scheduleNotificationAsync({
        identifier: `${taskId}-scheduled`,
        content: {
          title: '✅ Tarea programada',
          body: `La tarea "${title}" ha sido configurada`,
          data: { taskId, type: 'scheduled', title },
        },
        trigger: null,
      });

      console.log(`Notification scheduled for task: ${title}`);
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  }

  async cancelTaskNotifications(taskId: string): Promise<void> {
    try {
      if (!taskId) return;

      const scheduledNotifications = await this.getScheduledNotifications();
      const taskNotifications = scheduledNotifications.filter(
        (notification) => notification.identifier.startsWith(taskId)
      );

      for (const notification of taskNotifications) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }

  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }
}
