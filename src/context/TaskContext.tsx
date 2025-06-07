import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotificationService from '../services/NotificationService';

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
  getUserTasks: (username: string) => TaskData[];
  isLoading: boolean;
  toggleTaskNotifications: (taskId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

const TASKS_STORAGE_KEY = '@tasks';

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar tareas al iniciar
  useEffect(() => {
    loadTasks();
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      await NotificationService.requestPermissions();
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTasks = async (newTasks: TaskData[]) => {
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(newTasks));
      setTasks(newTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const scheduleTaskNotifications = async (task: TaskData) => {
    if (task.notificationsEnabled !== false) { // Default to enabled
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
  };

  const addTask = async (task: TaskData) => {
    const taskWithNotifications = { ...task, notificationsEnabled: true };
    const newTasks = [...tasks, taskWithNotifications];
    await saveTasks(newTasks);
    await scheduleTaskNotifications(taskWithNotifications);
  };

  const updateTask = async (updatedTask: TaskData) => {
    const newTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    await saveTasks(newTasks);
    
    // Reschedule notifications
    await NotificationService.cancelTaskNotifications(updatedTask.id);
    await scheduleTaskNotifications(updatedTask);
  };

  const updateTaskStatus = async (taskId: string, status: 'completed' | 'in-progress' | undefined) => {
    const newTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    );
    await saveTasks(newTasks);
  };

  const deleteTask = async (taskId: string) => {
    // Cancel notifications before deleting
    await NotificationService.cancelTaskNotifications(taskId);
    
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

    if (updatedTask.notificationsEnabled) {
      await scheduleTaskNotifications(updatedTask);
    } else {
      await NotificationService.cancelTaskNotifications(taskId);
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
