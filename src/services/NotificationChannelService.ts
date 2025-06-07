import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface INotificationChannelService {
  setupDefaultChannel(): Promise<void>;
  createChannel(id: string, name: string, options?: any): Promise<void>;
}

export class NotificationChannelService implements INotificationChannelService {
  async setupDefaultChannel(): Promise<void> {
    if (Platform.OS === 'android') {
      await this.createChannel('default', 'TareaApp Notifications', {
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#1e90ff',
      });
    }
  }

  async createChannel(id: string, name: string, options?: any): Promise<void> {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(id, {
          name,
          ...options,
        });
      }
    } catch (error) {
      console.error('Error creating notification channel:', error);
    }
  }
}
