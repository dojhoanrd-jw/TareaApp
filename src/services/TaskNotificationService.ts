import NotificationService from './NotificationService';
import { TaskData } from '../context/TaskContext';

export interface ITaskNotificationService {
  scheduleForTask(task: TaskData): Promise<void>;
  cancelForTask(taskId: string): Promise<void>;
  updateForTask(task: TaskData): Promise<void>;
  toggleForTask(task: TaskData): Promise<void>;
}

class TaskNotificationService implements ITaskNotificationService {
  async scheduleForTask(task: TaskData): Promise<void> {
    if (task.notificationsEnabled !== false) {
      try {
        await NotificationService.scheduleTaskNotifications(
          task.id,
          task.title,
          task.days,
          task.startTime,
          task.endTime
        );
      } catch (error) {
        console.error('Error scheduling notifications for task:', task.title, error);
      }
    }
  }

  async cancelForTask(taskId: string): Promise<void> {
    try {
      await NotificationService.cancelTaskNotifications(taskId);
    } catch (error) {
      console.error('Error canceling notifications for task:', taskId, error);
    }
  }

  async updateForTask(task: TaskData): Promise<void> {
    await this.cancelForTask(task.id);
    await this.scheduleForTask(task);
  }

  async toggleForTask(task: TaskData): Promise<void> {
    if (task.notificationsEnabled) {
      await this.scheduleForTask(task);
    } else {
      await this.cancelForTask(task.id);
    }
  }
}

export default new TaskNotificationService();
