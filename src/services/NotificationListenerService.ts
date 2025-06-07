import * as Notifications from 'expo-notifications';

export interface INotificationListenerService {
  addNotificationResponseListener(listener: (response: Notifications.NotificationResponse) => void): Notifications.Subscription;
  addNotificationReceivedListener(listener: (notification: Notifications.Notification) => void): Notifications.Subscription;
  setupNotificationHandler(): void;
}

export class NotificationListenerService implements INotificationListenerService {
  setupNotificationHandler(): void {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }

  addNotificationResponseListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }
}
