export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface INotificationStrategy {
  schedule(notification: NotificationData, trigger: any): Promise<string>;
  cancel(notificationId: string): Promise<void>;
  getType(): string;
}
