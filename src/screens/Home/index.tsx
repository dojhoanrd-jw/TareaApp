import React from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { useHomeScreen } from '../../hooks/useHomeScreen';
import TaskModal from '../../components/TaskModal';
import TaskView from '../../components/TaskView';
import TaskCard from '../../components/TaskCard';
import Header from '../../components/Header';
import FilterTasks from '../../components/FilterTasks';
import TasksHeader from '../../components/TasksHeader';
import EmptyState from './components/EmptyState';
import {
  Container,
  EmptyContainer,
  EmptyText,
  FloatingActionButton,
  FABIcon,
} from './styles';

const HomeScreen = () => {
  const {
    // State
    isModalVisible,
    isViewModalVisible,
    isEditMode,
    selectedTask,
    activeFilter,
    selectedDay,
    isLoading,
    
    // Computed values
    filteredTasks,
    taskCounts,
    
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
  } = useHomeScreen();

  const renderTask = ({ item }: { item: any }) => {
    return (
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
  };

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
        allCount={taskCounts.allCount}
        completedCount={taskCounts.completedCount}
        inProgressCount={taskCounts.inProgressCount}
      />

      <Container>
        <FlatList
          data={filteredTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            flexGrow: 1,
            paddingBottom: 80,
            paddingHorizontal: 0,
          }}
          style={{ flex: 1 }}
          ListEmptyComponent={() => (
            <EmptyState 
              activeFilter={activeFilter}
              selectedDay={selectedDay}
            />
          )}
        />

        <FloatingActionButton onPress={openNewTask}>
          <FABIcon>+</FABIcon>
        </FloatingActionButton>

        <TaskModal
          visible={isModalVisible}
          onClose={closeModal}
          onCreateTask={handleTaskCreated}
          editTask={selectedTask || undefined}
          isEditMode={isEditMode}
        />

        <TaskView
          visible={isViewModalVisible}
          task={selectedTask}
          onClose={closeViewModal}
          onEdit={handleEditTask}
        />
      </Container>
    </>
  );
};

export default HomeScreen;
