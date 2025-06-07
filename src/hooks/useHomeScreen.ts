import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTask, TaskData } from '../context/TaskContext';
import NotificationService from '../services/NotificationService';
import { FilterType } from '../components/FilterTasks';
import { DayFilter } from '../components/TasksHeader';
import { useErrorHandler } from './useErrorHandler';
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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedDay, setSelectedDay] = useState<DayFilter>('all');

  const { handleAsyncError, handleError } = useErrorHandler();

  const userTasks = user ? getUserTasks(user.username) : [];

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

  const handleTaskCreated = async (task: TaskData) => {
    await handleAsyncError(async () => {
      if (isEditMode && selectedTask) {
        await updateTask(task);
      } else {
        await addTask(task);
      }
      closeModal();
    }, 'Task creation/update');
  };

  const handleTaskPress = (task: TaskData) => {
    try {
      if (!task || !task.id) {
        throw new AppError(
          'Tarea inválida seleccionada',
          ErrorType.VALIDATION,
          'INVALID_TASK_SELECTED',
          { task }
        );
      }
      setSelectedTask(task);
      setIsViewModalVisible(true);
    } catch (error) {
      const appError = error instanceof AppError || error instanceof Error 
        ? error 
        : new AppError(
            'Error desconocido al seleccionar tarea',
            ErrorType.UNKNOWN,
            'UNKNOWN_TASK_SELECTION_ERROR',
            { originalError: error }
          );
      handleError(appError, 'Task selection');
    }
  };

  const handleEditTask = (task: TaskData) => {
    try {
      if (!task || !task.id) {
        throw new AppError(
          'Tarea inválida para edición',
          ErrorType.VALIDATION,
          'INVALID_TASK_EDIT',
          { task }
        );
      }
      
      setIsViewModalVisible(false);
      setTimeout(() => {
        setSelectedTask(task);
        setIsEditMode(true);
        setIsModalVisible(true);
      }, 150);
    } catch (error) {
      const appError = error instanceof AppError || error instanceof Error 
        ? error 
        : new AppError(
            'Error desconocido al editar tarea',
            ErrorType.UNKNOWN,
            'UNKNOWN_TASK_EDIT_ERROR',
            { originalError: error }
          );
      handleError(appError, 'Task edit');
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsEditMode(false);
    setSelectedTask(null);
  };

  const closeViewModal = () => {
    setIsViewModalVisible(false);
    setTimeout(() => {
      setSelectedTask(null);
    }, 100);
  };

  const openNewTask = () => {
    setSelectedTask(null);
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!taskId) {
      handleError(
        new AppError(
          'ID de tarea inválido para eliminación',
          ErrorType.VALIDATION,
          'INVALID_TASK_ID_DELETE'
        ),
        'Task deletion validation'
      );
      return;
    }

    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => handleAsyncError(
            () => deleteTask(taskId),
            'Task deletion',
            (error) => Alert.alert('Error', 'No se pudo eliminar la tarea: ' + error.message)
          ),
        },
      ]
    );
  };

  const handleCompleteTask = (taskId: string) => {
    if (!taskId) {
      handleError(
        new AppError(
          'ID de tarea inválido para completar',
          ErrorType.VALIDATION,
          'INVALID_TASK_ID_COMPLETE'
        ),
        'Task completion validation'
      );
      return;
    }

    Alert.alert(
      'Completar Tarea',
      '¿Marcar esta tarea como completada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Completar',
          onPress: () => handleAsyncError(
            async () => {
              await deleteTask(taskId);
              Alert.alert('¡Excelente!', 'Tarea completada correctamente');
            },
            'Task completion',
            (error) => Alert.alert('Error', 'No se pudo completar la tarea: ' + error.message)
          ),
        },
      ]
    );
  };

  const handleToggleTaskStatus = async (taskId: string) => {
    await handleAsyncError(async () => {
      if (!taskId) {
        throw new AppError(
          'ID de tarea inválido para cambio de estado',
          ErrorType.VALIDATION,
          'INVALID_TASK_ID_STATUS'
        );
      }

      const task = userTasks.find(t => t.id === taskId);
      if (!task) {
        throw new AppError(
          'Tarea no encontrada',
          ErrorType.TASK,
          'TASK_NOT_FOUND',
          { taskId }
        );
      }

      let newStatus: 'completed' | 'in-progress' | undefined;
      
      if (!task.status) {
        newStatus = 'in-progress';
      } else if (task.status === 'in-progress') {
        newStatus = 'completed';
      } else {
        newStatus = undefined;
      }

      await updateTaskStatus(taskId, newStatus);
    }, 'Task status toggle');
  };

  const handleToggleNotifications = async (taskId: string) => {
    await handleAsyncError(async () => {
      if (!taskId) {
        throw new AppError(
          'ID de tarea inválido para notificaciones',
          ErrorType.VALIDATION,
          'INVALID_TASK_ID_NOTIFICATIONS'
        );
      }

      const task = userTasks.find(t => t.id === taskId);
      if (!task) {
        throw new AppError(
          'Tarea no encontrada para notificaciones',
          ErrorType.TASK,
          'TASK_NOT_FOUND_NOTIFICATIONS',
          { taskId }
        );
      }

      await toggleTaskNotifications(taskId);
      const newStatus = !task.notificationsEnabled;
      Alert.alert(
        'Notificaciones',
        `Notificaciones ${newStatus ? 'activadas' : 'desactivadas'} para "${task.title}"`
      );
    }, 'Notification toggle');
  };

  // Initialize notifications
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const responseSubscription = NotificationService.addNotificationResponseListener(
          (response) => {
            try {
              const data = response.notification.request.content.data as any;
              if (data?.taskId) {
                Alert.alert(
                  'Recordatorio de tarea',
                  `${data.type === 'start' ? 'Tiempo de empezar' : 'Tiempo de finalizar'}: ${data.title}`
                );
              }
            } catch (error) {
              const appError = error instanceof AppError || error instanceof Error 
                ? error 
                : new AppError(
                    'Error procesando respuesta de notificación',
                    ErrorType.NOTIFICATION,
                    'NOTIFICATION_RESPONSE_ERROR',
                    { originalError: error }
                  );
              handleError(appError, 'Notification response handler');
            }
          }
        );

        const receivedSubscription = NotificationService.addNotificationReceivedListener(
          (notification) => {
            if (__DEV__) {
              console.log('Notification received:', notification);
            }
          }
        );

        return () => {
          responseSubscription.remove();
          receivedSubscription.remove();
        };
      } catch (error) {
        const appError = error instanceof AppError || error instanceof Error 
          ? error 
          : new AppError(
              'Error configurando notificaciones',
              ErrorType.NOTIFICATION,
              'NOTIFICATION_SETUP_ERROR',
              { originalError: error }
            );
        handleError(appError, 'Notification setup');
      }
    };

    setupNotifications();
  }, []);

  return {
    // State
    isModalVisible,
    isViewModalVisible,
    isEditMode,
    selectedTask,
    activeFilter,
    selectedDay,
    isLoading,
    
    // Computed values
    filteredTasks: getFilteredTasks(),
    taskCounts: getTaskCounts(),
    
    // Actions
    setActiveFilter,
    setSelectedDay,
    handleTaskCreated,
    handleTaskPress,
    handleEditTask,
    closeModal,
    closeViewModal,
    openNewTask,
    handleDeleteTask,
    handleCompleteTask,
    handleToggleTaskStatus,
    handleToggleNotifications,
  };
};
