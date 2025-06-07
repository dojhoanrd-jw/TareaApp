import React, { useState, useEffect } from 'react';
import { FlatList, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTask, TaskData } from '../../context/TaskContext';
import TaskModal from '../../components/TaskModal';
import TaskView from '../../components/TaskView';
import TaskCard from '../../components/TaskCard';
import Header from '../../components/Header';
import FilterTasks, { FilterType } from '../../components/FilterTasks';
import TasksHeader, { DayFilter } from '../../components/TasksHeader';
import NotificationService from '../../services/NotificationService';
import {
  Container,
  EmptyContainer,
  EmptyText,
  FloatingActionButton,
  FABIcon,
} from './styles';

const HomeScreen = () => {
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

  // Filter tasks based on active filter and selected day
  const filteredTasks = userTasks.filter(task => {
    // Filter by status
    const statusMatch = 
      activeFilter === 'all' || 
      (activeFilter === 'completed' && task.status === 'completed') ||
      (activeFilter === 'in-progress' && task.status === 'in-progress');

    // Filter by day
    const dayMatch = 
      selectedDay === 'all' || 
      task.days.includes(selectedDay);

    return statusMatch && dayMatch;
  });

  // Count tasks by status
  const allCount = userTasks.length;
  const completedCount = userTasks.filter(task => task.status === 'completed').length;
  const inProgressCount = userTasks.filter(task => task.status === 'in-progress').length;

  const handleTaskCreated = async (task: TaskData) => {
    if (isEditMode && selectedTask) {
      await updateTask(task);
    } else {
      await addTask(task);
    }
    setIsModalVisible(false);
    setIsEditMode(false);
    setSelectedTask(null);
  };

  const handleTaskPress = (task: TaskData) => {
    setSelectedTask(task);
    setIsViewModalVisible(true);
  };

  const handleEditTask = (task: TaskData) => {
    console.log('Editing task:', task); 
    setIsViewModalVisible(false);
    
    
    setTimeout(() => {
      setSelectedTask(task);
      setIsEditMode(true);
      setIsModalVisible(true);
    }, 150); 
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setIsEditMode(false);
    setSelectedTask(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setTimeout(() => {
      setSelectedTask(null);
    }, 100);
  };

  const handleOpenNewTask = () => {
    setSelectedTask(null);
    setIsEditMode(false);
    setIsModalVisible(true);
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
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
        {
          text: 'Cancelar',
          style: 'cancel',
        },
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

  const renderTask = ({ item }: { item: TaskData }) => (
    <TaskCard
      id={item.id}
      title={item.title}
      description={item.description}
      days={item.days}
      startTime={item.startTime}
      endTime={item.endTime}
      user={item.user}
      status={item.status}
      notificationsEnabled={item.notificationsEnabled}
      onPress={() => handleTaskPress(item)}
      onDelete={handleDeleteTask}
      onComplete={handleCompleteTask}
      onToggleStatus={handleToggleTaskStatus}
      onToggleNotifications={handleToggleNotifications}
    />
  );

  const renderEmptyState = () => (
    <EmptyContainer>
      <EmptyText>
        {activeFilter === 'all' 
          ? selectedDay === 'all' 
            ? 'No tienes tareas creadas'
            : `No tienes tareas para ${DAYS_OPTIONS.find(d => d.key === selectedDay)?.label}`
          : activeFilter === 'completed'
          ? 'No tienes tareas completadas'
          : 'No tienes tareas en progreso'
        }
      </EmptyText>
      {activeFilter === 'all' && selectedDay === 'all' && (
        <EmptyText>Presiona el botón + para crear tu primera tarea</EmptyText>
      )}
    </EmptyContainer>
  );

  useEffect(() => {
    // Initialize notification listeners
    const responseSubscription = NotificationService.addNotificationResponseListener(
      (response) => {
        const data = response.notification.request.content.data as any;
        if (data?.taskId) {
          // Handle notification tap - could navigate to task or show alert
          Alert.alert(
            'Recordatorio de tarea',
            `${data.type === 'start' ? 'Tiempo de empezar' : 'Tiempo de finalizar'}: ${data.title}`
          );
        }
      }
    );

    const receivedSubscription = NotificationService.addNotificationReceivedListener(
      (notification) => {
        // Handle foreground notifications
        console.log('Notification received:', notification);
      }
    );

    return () => {
      responseSubscription.remove();
      receivedSubscription.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <>
        <Header />
        <Container>
          <EmptyContainer>
            <ActivityIndicator size="large" color="#1e90ff" />
            <EmptyText>Cargando tareas...</EmptyText>
          </EmptyContainer>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      
      <TasksHeader
        selectedDay={selectedDay}
        onDayChange={setSelectedDay}
      />
      
      <FilterTasks
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        allCount={allCount}
        completedCount={completedCount}
        inProgressCount={inProgressCount}
      />

      <Container>
        <FlatList
          data={filteredTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            flexGrow: 1,
            paddingBottom: 80
          }}
          ListEmptyComponent={renderEmptyState}
        />

        <FloatingActionButton onPress={handleOpenNewTask}>
          <FABIcon>+</FABIcon>
        </FloatingActionButton>

        <TaskModal
          visible={isModalVisible}
          onClose={handleCloseModal}
          onCreateTask={handleTaskCreated}
          editTask={selectedTask || undefined}
          isEditMode={isEditMode}
        />

        <TaskView
          visible={isViewModalVisible}
          task={selectedTask}
          onClose={handleCloseViewModal}
          onEdit={handleEditTask}
        />
      </Container>
    </>
  );
};

const DAYS_OPTIONS = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
];

export default HomeScreen;
