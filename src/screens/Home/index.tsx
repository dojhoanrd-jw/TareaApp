import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { useAuth } from '../../context/AuthContext';
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

interface TaskData {
  id: string;
  title: string;
  description: string;
  days: string[];
  startTime: string;
  endTime: string;
  user: string;
}

const HomeScreen = () => {
  const { user } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [tasks, setTasks] = useState<TaskData[]>([]);

  const handleTaskCreated = (task: TaskData) => {
    if (isEditMode && selectedTask) {
      setTasks(prevTasks => 
        prevTasks.map(t => t.id === selectedTask.id ? task : t)
      );
    } else {
      setTasks(prevTasks => [...prevTasks, task]);
    }
    setIsEditMode(false);
    setSelectedTask(null);
  };

  const handleTaskPress = (task: TaskData) => {
    setSelectedTask(task);
    setIsViewModalVisible(true);
  };

  const handleEditTask = (task: TaskData) => {
    setSelectedTask(task);
    setIsEditMode(true);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setIsEditMode(false);
      setSelectedTask(null);
    }, 300); 
  };

  const handleCloseViewModal = () => {
    setIsViewModalVisible(false);
    setSelectedTask(null);
  };

  const handleOpenNewTask = () => {
    setIsEditMode(false);
    setSelectedTask(null);
    setIsModalVisible(true);
  };

  const userTasks = tasks.filter(task => task.user === user?.username);

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
