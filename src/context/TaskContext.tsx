import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import NotificationService from '../services/NotificationService';
import TaskStorageService, { ITaskStorageService } from '../services/TaskStorageService';
import TaskNotificationService, { ITaskNotificationService } from '../services/TaskNotificationService';

export interface TaskData {
  id: string;
  title: string;
  description: string;
  days: string[];
  startTime: string;
  endTime: string;
  user: string;
  status?: 'completed' | 'in-progress';
  notificationsEnabled?: boolean;
}

interface TaskContextProps {
  tasks: TaskData[];
  addTask: (task: TaskData) => Promise<void>;
  updateTask: (task: TaskData) => Promise<void>;
  updateTaskStatus: (taskId: string, status: 'completed' | 'in-progress' | undefined) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  reorderTasks: (username: string, newTaskOrder: TaskData[]) => Promise<void>;
  getUserTasks: (username: string) => TaskData[];
  isLoading: boolean;
  toggleTaskNotifications: (taskId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
  storageService?: ITaskStorageService;
  notificationService?: ITaskNotificationService;
}

export const TaskProvider = ({ 
  children, 
  storageService = TaskStorageService,
  notificationService = TaskNotificationService 
}: TaskProviderProps) => {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar tareas al iniciar
  useEffect(() => {
    loadTasks();
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      await NotificationService.initialize();
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const loadedTasks = await storageService.loadTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTasks = async (newTasks: TaskData[]) => {
    try {
      await storageService.saveTasks(newTasks);
      setTasks(newTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const addTask = async (task: TaskData) => {
    const taskWithNotifications = { ...task, notificationsEnabled: true };
    const newTasks = [...tasks, taskWithNotifications];
    await saveTasks(newTasks);
    await notificationService.scheduleForTask(taskWithNotifications);
  };

  const updateTask = async (updatedTask: TaskData) => {
    const newTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    await saveTasks(newTasks);
    await notificationService.updateForTask(updatedTask);
  };

  const updateTaskStatus = async (taskId: string, status: 'completed' | 'in-progress' | undefined) => {
    const newTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    );
    await saveTasks(newTasks);
  };

  const deleteTask = async (taskId: string) => {
    await notificationService.cancelForTask(taskId);
    const newTasks = tasks.filter(task => task.id !== taskId);
    await saveTasks(newTasks);
  };

  const toggleTaskNotifications = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask = { 
      ...task, 
      notificationsEnabled: !task.notificationsEnabled 
    };

    const newTasks = tasks.map(t => 
      t.id === taskId ? updatedTask : t
    );

    await saveTasks(newTasks);
    await notificationService.toggleForTask(updatedTask);
  };

  const reorderTasks = async (username: string, newTaskOrder: TaskData[]) => {
    try {
      const otherUsersTasks = tasks.filter(task => task.user !== username);
      const allTasks = [...otherUsersTasks, ...newTaskOrder];
      await saveTasks(allTasks);
    } catch (error) {
      console.error('Error reordering tasks:', error);
    }
  };

  const getUserTasks = (username: string): TaskData[] => {
    return tasks.filter(task => task.user === username);
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      updateTaskStatus,
      deleteTask,
      reorderTasks,
      getUserTasks,
      isLoading,
      toggleTaskNotifications,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTask debe usarse dentro de TaskProvider');
  return context;
};
