import * as Notifications from 'expo-notifications';
import { INotificationStrategy, NotificationData } from './INotificationStrategy';

export class TaskNotificationStrategy implements INotificationStrategy {
  getType(): string {
    return 'task';
  }

  async schedule(notification: NotificationData, trigger: any): Promise<string> {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
      },
      trigger,
    });
    return notificationId;
  }

  async cancel(notificationId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
}
