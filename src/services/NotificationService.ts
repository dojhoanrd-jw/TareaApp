import { Platform } from 'react-native';

// Conditional import with error handling
let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
  
  // Configure notification behavior only if available
  if (Notifications) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }
} catch (error) {
  console.warn('expo-notifications is not available:', error);
}

export interface NotificationData {
  taskId: string;
  title: string;
  type: 'start' | 'end';
}

class NotificationService {
  private static instance: NotificationService;
  private permissionGranted: boolean = false;
  private isAvailable: boolean = false;

  private constructor() {
    this.isAvailable = Notifications !== null;
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Check if notifications are available
   */
  isNotificationAvailable(): boolean {
    return this.isAvailable;
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (!this.isAvailable) {
      console.warn('Notifications not available');
      return false;
    }

    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('tasks', {
          name: 'Task Notifications',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#1e90ff',
          description: 'Notifications for task reminders',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      this.permissionGranted = finalStatus === 'granted';
      return this.permissionGranted;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Schedule notifications for a task
   */
  async scheduleTaskNotifications(
    taskId: string,
    title: string,
    days: string[],
    startTime: string,
    endTime: string
  ): Promise<void> {
    if (!this.isAvailable) {
      console.warn('Notifications not available - skipping scheduling');
      return;
    }

    if (!this.permissionGranted) {
      const granted = await this.requestPermissions();
      if (!granted) {
        console.warn('Notification permissions not granted');
        return;
      }
    }

    try {
      // Cancel existing notifications for this task
      await this.cancelTaskNotifications(taskId);

      const dayMap: { [key: string]: number } = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
      };

      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);

      for (const day of days) {
        const weekday = dayMap[day];
        if (weekday === undefined) continue;

        // Schedule start notification
        await Notifications.scheduleNotificationAsync({
          identifier: `${taskId}_start_${day}`,
          content: {
            title: '⏰ Hora de empezar',
            body: `Es hora de comenzar: ${title}`,
            data: {
              taskId,
              title,
              type: 'start',
            } as NotificationData,
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            weekday: weekday + 1, // expo-notifications uses 1-7 for Sunday-Saturday
            hour: startHour,
            minute: startMinute,
            repeats: true,
          },
        });

        // Schedule end notification
        await Notifications.scheduleNotificationAsync({
          identifier: `${taskId}_end_${day}`,
          content: {
            title: '✅ Tiempo de finalizar',
            body: `Tiempo de finalizar: ${title}`,
            data: {
              taskId,
              title,
              type: 'end',
            } as NotificationData,
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            weekday: weekday + 1,
            hour: endHour,
            minute: endMinute,
            repeats: true,
          },
        });
      }

      console.log(`Scheduled notifications for task: ${title}`);
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  }

  /**
   * Cancel all notifications for a specific task
   */
  async cancelTaskNotifications(taskId: string): Promise<void> {
    if (!this.isAvailable) {
      return;
    }

    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      const taskNotificationIds = scheduledNotifications
        .filter(notification => notification.identifier.startsWith(taskId))
        .map(notification => notification.identifier);

      if (taskNotificationIds.length > 0) {
        await Notifications.cancelScheduledNotificationsAsync(taskNotificationIds);
        console.log(`Cancelled ${taskNotificationIds.length} notifications for task ${taskId}`);
      }
    } catch (error) {
      console.error('Error cancelling task notifications:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    if (!this.isAvailable) {
      return;
    }

    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  /**
   * Get all scheduled notifications (for debugging)
   */
  async getScheduledNotifications(): Promise<any[]> {
    if (!this.isAvailable) {
      return [];
    }

    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  /**
   * Handle notification response
   */
  addNotificationResponseListener(
    listener: (response: any) => void
  ): any {
    if (!this.isAvailable) {
      return { remove: () => {} }; // Return dummy subscription
    }

    return Notifications.addNotificationResponseReceivedListener(listener);
  }

  /**
   * Handle foreground notifications
   */
  addNotificationReceivedListener(
    listener: (notification: any) => void
  ): any {
    if (!this.isAvailable) {
      return { remove: () => {} }; // Return dummy subscription
    }

    return Notifications.addNotificationReceivedListener(listener);
  }
}

export default NotificationService.getInstance();
