import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask, TaskData } from '../context/TaskContext';
import { FilterType } from '../components/FilterTasks';
import { DayFilter } from '../components/TasksHeader';
import { useErrorHandler } from './useErrorHandler';
import { useNotificationSetup } from './useNotificationSetup';
import { useTaskActions } from './useTaskActions';
import { AppError, ErrorType } from '../utils/ErrorHandler';

export const useHomeScreen = () => {
  const { user } = useAuth();
  const { 
    getUserTasks, 
    addTask, 
    updateTask, 
    updateTaskStatus, 
    deleteTask, 
    toggleTaskNotifications,
    isLoading 
  } = useTask();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedDay, setSelectedDay] = useState<DayFilter>('all');

  const { handleError } = useErrorHandler();

  const userTasks = user ? getUserTasks(user.username) : [];

  // Initialize notifications
  useNotificationSetup();

  // Task actions
  const taskActions = useTaskActions({
    userTasks,
    updateTask,
    addTask,
    deleteTask,
    updateTaskStatus,
    toggleTaskNotifications,
  });

  // Business logic methods
  const getFilteredTasks = () => {
    try {
      return userTasks.filter(task => {
        const statusMatch = 
          activeFilter === 'all' || 
          (activeFilter === 'completed' && task.status === 'completed') ||
          (activeFilter === 'in-progress' && task.status === 'in-progress');

        const dayMatch = 
          selectedDay === 'all' || 
          task.days.includes(selectedDay);

        return statusMatch && dayMatch;
      });
    } catch (error) {
      handleError(
        new AppError(
          'Error al filtrar tareas',
          ErrorType.TASK,
          'FILTER_TASKS_ERROR',
          { activeFilter, selectedDay, userTasksCount: userTasks.length, originalError: error }
        ),
        'getFilteredTasks'
      );
      return [];
    }
  };

  const getTaskCounts = () => {
    try {
      return {
        allCount: userTasks.length,
        completedCount: userTasks.filter(task => task.status === 'completed').length,
        inProgressCount: userTasks.filter(task => task.status === 'in-progress').length,
      };
    } catch (error) {
      handleError(
        new AppError(
          'Error al calcular conteos de tareas',
          ErrorType.TASK,
          'TASK_COUNTS_ERROR',
          { userTasksCount: userTasks.length, originalError: error }
        ),
        'getTaskCounts'
      );
      return { allCount: 0, completedCount: 0, inProgressCount: 0 };
    }
  };

  return {
    // State
    activeFilter,
    selectedDay,
    isLoading,
    
    // Computed values
    filteredTasks: getFilteredTasks(),
    taskCounts: getTaskCounts(),
    
    // Actions
    setActiveFilter,
    setSelectedDay,
    
    // Task actions from dedicated hook
    ...taskActions,
  };
};
