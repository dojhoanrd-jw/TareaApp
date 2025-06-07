import * as Notifications from 'expo-notifications';
import { NotificationSchedulerService, INotificationSchedulerService } from './NotificationSchedulerService';
import { NotificationListenerService, INotificationListenerService } from './NotificationListenerService';

export interface INotificationManager {
  // Scheduling
  scheduleTaskNotifications(
    taskId: string,
    title: string,
    days: string[],
    startTime: string,
    endTime: string
  ): Promise<void>;
  cancelTaskNotifications(taskId: string): Promise<void>;
  cancelAllNotifications(): Promise<void>;
  getScheduledNotifications(): Promise<Notifications.NotificationRequest[]>;

  // Listeners
  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription;
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription;
}

class NotificationManager implements INotificationManager {
  private schedulerService: INotificationSchedulerService;
  private listenerService: INotificationListenerService;

  constructor() {
    this.schedulerService = new NotificationSchedulerService();
    this.listenerService = new NotificationListenerService();
    
    // Setup notification handler on initialization
    this.listenerService.setupNotificationHandler();
  }

  // Scheduling methods
  async scheduleTaskNotifications(
    taskId: string,
    title: string,
    days: string[],
    startTime: string,
    endTime: string
  ): Promise<void> {
    return this.schedulerService.scheduleTaskNotifications(taskId, title, days, startTime, endTime);
  }

  async cancelTaskNotifications(taskId: string): Promise<void> {
    return this.schedulerService.cancelTaskNotifications(taskId);
  }

  async cancelAllNotifications(): Promise<void> {
    return this.schedulerService.cancelAllNotifications();
  }

  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return this.schedulerService.getScheduledNotifications();
  }

  // Listener methods
  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return this.listenerService.addNotificationResponseListener(listener);
  }

  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return this.listenerService.addNotificationReceivedListener(listener);
  }
}

export { NotificationManager };
