import React, { useState } from 'react';
import { FlatList, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTask, TaskData } from '../../context/TaskContext';
import TaskModal from '../../components/TaskModal';
import TaskView from '../../components/TaskView';
import TaskCard from '../../components/TaskCard';
import Header from '../../components/Header';
import FilterTasks, { FilterType } from '../../components/FilterTasks';
import {
  Container,
  EmptyContainer,
  EmptyText,
  FloatingActionButton,
  FABIcon,
} from './styles';

const HomeScreen = () => {
  const { user } = useAuth();
  const { getUserTasks, addTask, updateTask, updateTaskStatus, deleteTask, isLoading } = useTask();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const userTasks = user ? getUserTasks(user.username) : [];

  // Filter tasks based on active filter
  const filteredTasks = userTasks.filter(task => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'completed') return task.status === 'completed';
    if (activeFilter === 'in-progress') return task.status === 'in-progress';
    return true;
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
      onPress={() => handleTaskPress(item)}
      onDelete={handleDeleteTask}
      onComplete={handleCompleteTask}
      onToggleStatus={handleToggleTaskStatus}
    />
  );

  const renderEmptyState = () => (
    <EmptyContainer>
      <EmptyText>
        {activeFilter === 'all' 
          ? 'No tienes tareas creadas'
          : activeFilter === 'completed'
          ? 'No tienes tareas completadas'
          : 'No tienes tareas en progreso'
        }
      </EmptyText>
      {activeFilter === 'all' && (
        <EmptyText>Presiona el botón + para crear tu primera tarea</EmptyText>
      )}
    </EmptyContainer>
  );

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

export default HomeScreen;
