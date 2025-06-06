import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TaskData {
  id: string;
  title: string;
  description: string;
  days: string[];
  startTime: string;
  endTime: string;
  user: string;
  status?: 'completed' | 'in-progress';
}

interface TaskContextProps {
  tasks: TaskData[];
  addTask: (task: TaskData) => Promise<void>;
  updateTask: (task: TaskData) => Promise<void>;
  updateTaskStatus: (taskId: string, status: 'completed' | 'in-progress' | undefined) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  getUserTasks: (username: string) => TaskData[];
  isLoading: boolean;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

const TASKS_STORAGE_KEY = '@tasks';

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar tareas al iniciar
  useEffect(() => {
    loadTasks();
  }, []);

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

  const addTask = async (task: TaskData) => {
    const newTasks = [...tasks, task];
    await saveTasks(newTasks);
  };

  const updateTask = async (updatedTask: TaskData) => {
    const newTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    await saveTasks(newTasks);
  };

  const updateTaskStatus = async (taskId: string, status: 'completed' | 'in-progress' | undefined) => {
    const newTasks = tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    );
    await saveTasks(newTasks);
  };

  const deleteTask = async (taskId: string) => {
    const newTasks = tasks.filter(task => task.id !== taskId);
    await saveTasks(newTasks);
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
