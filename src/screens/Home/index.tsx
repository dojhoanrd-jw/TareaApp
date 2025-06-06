import React, { useState } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTask, TaskData } from '../../context/TaskContext';
import TaskModal from '../../components/TaskModal';
import TaskView from '../../components/TaskView';
import TaskCard from '../../components/TaskCard';
import Header from '../../components/Header';
import {
  Container,
  EmptyContainer,
  EmptyText,
  FloatingActionButton,
  FABIcon,
} from './styles';

const HomeScreen = () => {
  const { user } = useAuth();
  const { getUserTasks, addTask, updateTask, isLoading } = useTask();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);

  const userTasks = user ? getUserTasks(user.username) : [];

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

  const renderTask = ({ item }: { item: TaskData }) => (
    <TaskCard
      id={item.id}
      title={item.title}
      description={item.description}
      days={item.days}
      startTime={item.startTime}
      endTime={item.endTime}
      user={item.user}
      onPress={() => handleTaskPress(item)}
    />
  );

  const renderEmptyState = () => (
    <EmptyContainer>
      <EmptyText>No tienes tareas creadas</EmptyText>
      <EmptyText>Presiona el botón + para crear tu primera tarea</EmptyText>
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
      <Container>
        <FlatList
          data={userTasks}
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
