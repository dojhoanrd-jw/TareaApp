import * as Notifications from 'expo-notifications';
import { NotificationCoordinator, INotificationCoordinator } from './NotificationCoordinator';
import { NotificationManager, INotificationManager } from './NotificationManager';
import { INotificationStrategy } from './notifications/INotificationStrategy';
import { TaskNotificationStrategy } from './notifications/TaskNotificationStrategy';

class NotificationService {
  private coordinator: INotificationCoordinator;
  private manager: INotificationManager;
  private strategies: Map<string, INotificationStrategy> = new Map();

  constructor() {
    this.coordinator = new NotificationCoordinator();
    this.manager = new NotificationManager();
    this.initializeStrategies();
  }

  private initializeStrategies(): void {
    this.registerStrategy(new TaskNotificationStrategy());
  }

  registerStrategy(strategy: INotificationStrategy): void {
    this.strategies.set(strategy.getType(), strategy);
  }

  private getStrategy(type: string): INotificationStrategy {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(`No notification strategy found for type: ${type}`);
    }
    return strategy;
  }

  // Initialization
  async initialize(): Promise<boolean> {
    return this.coordinator.initialize();
  }

  async requestPermissions(): Promise<boolean> {
    return this.coordinator.requestPermissions();
  }

  // Scheduling - delegate to manager
  async scheduleTaskNotifications(
    taskId: string,
    title: string,
    days: string[],
    startTime: string,
    endTime: string
  ): Promise<void> {
    return this.manager.scheduleTaskNotifications(taskId, title, days, startTime, endTime);
  }

  async cancelTaskNotifications(taskId: string): Promise<void> {
    return this.manager.cancelTaskNotifications(taskId);
  }

  async cancelAllNotifications(): Promise<void> {
    return this.manager.cancelAllNotifications();
  }

  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return this.manager.getScheduledNotifications();
  }

  // Listeners - delegate to manager
  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return this.manager.addNotificationResponseListener(listener);
  }

  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return this.manager.addNotificationReceivedListener(listener);
  }

  // Extensible notification scheduling
  async scheduleNotification(
    type: string,
    notification: any,
    trigger: any
  ): Promise<string> {
    const strategy = this.getStrategy(type);
    return strategy.schedule(notification, trigger);
  }

  async cancelNotification(type: string, notificationId: string): Promise<void> {
    const strategy = this.getStrategy(type);
    return strategy.cancel(notificationId);
  }
}

export default new NotificationService();
