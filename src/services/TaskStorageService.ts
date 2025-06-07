import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskData } from '../context/TaskContext';

export interface ITaskStorageService {
  loadTasks(): Promise<TaskData[]>;
  saveTasks(tasks: TaskData[]): Promise<void>;
  clearTasks(): Promise<void>;
}

class TaskStorageService implements ITaskStorageService {
  private readonly TASKS_STORAGE_KEY = '@tasks';

  async loadTasks(): Promise<TaskData[]> {
    try {
      const storedTasks = await AsyncStorage.getItem(this.TASKS_STORAGE_KEY);
      if (storedTasks) {
        return JSON.parse(storedTasks);
      }
      return [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  async saveTasks(tasks: TaskData[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw error;
    }
  }

  async clearTasks(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.TASKS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing tasks:', error);
      throw error;
    }
  }
}

export default new TaskStorageService();
