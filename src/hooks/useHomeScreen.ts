import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTask, TaskData } from '../context/TaskContext';
import NotificationService from '../services/NotificationService';
import { FilterType } from '../components/FilterTasks';
import { DayFilter } from '../components/TasksHeader';

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

  const userTasks = user ? getUserTasks(user.username) : [];

  // Business logic methods
  const getFilteredTasks = () => {
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
  };

  const getTaskCounts = () => ({
    allCount: userTasks.length,
    completedCount: userTasks.filter(task => task.status === 'completed').length,
    inProgressCount: userTasks.filter(task => task.status === 'in-progress').length,
  });

  const handleTaskCreated = async (task: TaskData) => {
    if (isEditMode && selectedTask) {
      await updateTask(task);
    } else {
      await addTask(task);
    }
    closeModal();
  };

  const handleTaskPress = (task: TaskData) => {
    setSelectedTask(task);
    setIsViewModalVisible(true);
  };

  const handleEditTask = (task: TaskData) => {
    setIsViewModalVisible(false);
    setTimeout(() => {
      setSelectedTask(task);
      setIsEditMode(true);
      setIsModalVisible(true);
    }, 150);
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
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(taskId);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la tarea');
            }
          },
        },
      ]
    );
  };

  const handleCompleteTask = (taskId: string) => {
    Alert.alert(
      'Completar Tarea',
      '¿Marcar esta tarea como completada?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Completar',
          onPress: async () => {
            try {
              await deleteTask(taskId);
              Alert.alert('¡Excelente!', 'Tarea completada correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo completar la tarea');
            }
          },
        },
      ]
    );
  };

  const handleToggleTaskStatus = async (taskId: string) => {
    const task = userTasks.find(t => t.id === taskId);
    if (!task) return;

    let newStatus: 'completed' | 'in-progress' | undefined;
    
    if (!task.status) {
      newStatus = 'in-progress';
    } else if (task.status === 'in-progress') {
      newStatus = 'completed';
    } else {
      newStatus = undefined;
    }

    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado de la tarea');
    }
  };

  const handleToggleNotifications = async (taskId: string) => {
    try {
      await toggleTaskNotifications(taskId);
      const task = userTasks.find(t => t.id === taskId);
      const newStatus = !task?.notificationsEnabled;
      Alert.alert(
        'Notificaciones',
        `Notificaciones ${newStatus ? 'activadas' : 'desactivadas'} para "${task?.title}"`
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudieron actualizar las notificaciones');
    }
  };

  // Initialize notifications
  useEffect(() => {
    const setupNotifications = async () => {
      const responseSubscription = NotificationService.addNotificationResponseListener(
        (response) => {
          const data = response.notification.request.content.data as any;
          if (data?.taskId) {
            Alert.alert(
              'Recordatorio de tarea',
              `${data.type === 'start' ? 'Tiempo de empezar' : 'Tiempo de finalizar'}: ${data.title}`
            );
          }
        }
      );

      const receivedSubscription = NotificationService.addNotificationReceivedListener(
        (notification) => {
          console.log('Notification received:', notification);
        }
      );

      return () => {
        responseSubscription.remove();
        receivedSubscription.remove();
      };
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
