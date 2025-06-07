import React from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { useHomeScreen } from '../../hooks/useHomeScreen';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import TaskModal from '../../components/TaskModal';
import TaskView from '../../components/TaskView';
import TaskCard from '../../components/TaskCard';
import Header from '../../components/Header';
import FilterTasks from '../../components/FilterTasks';
import TasksHeader from '../../components/TasksHeader';
import DraggableTaskCard from '../../components/DraggableTaskCard';
import EmptyState from './components/EmptyState';
import {
  Container,
  EmptyContainer,
  EmptyText,
  FloatingActionButton,
  FABIcon,
  ReorderButton,
  ReorderText,
} from './styles';

const HomeScreen = () => {
  const theme = useTheme();
  const {
    // State
    isModalVisible,
    isViewModalVisible,
    isEditMode,
    selectedTask,
    activeFilter,
    selectedDay,
    isDragModeEnabled,
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
    handleReorderTasks,
    toggleDragMode,
  } = useHomeScreen();

  const {
    isDragging,
    onDragStart,
    onDragMove,
    onDragEnd,
    getItemStyle,
  } = useDragAndDrop({
    data: filteredTasks,
    onReorder: handleReorderTasks,
    keyExtractor: (item) => item.id,
    itemHeight: 120,
  });

  const renderTask = ({ item, index }: { item: any; index: number }) => {
    if (isDragModeEnabled && activeFilter === 'all' && selectedDay === 'all') {
      return (
        <DraggableTaskCard
          task={item}
          index={index}
          isDragEnabled={true}
          style={getItemStyle(index)}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          onPress={() => handleTaskPress(item)}
          onDelete={handleDeleteTask}
          onComplete={handleCompleteTask}
          onToggleStatus={handleToggleTaskStatus}
          onToggleNotifications={handleToggleNotifications}
        />
      );
    }

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
          scrollEnabled={!isDragging}
          contentContainerStyle={{ 
            flexGrow: 1,
            paddingBottom: 160,
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

        {activeFilter === 'all' && selectedDay === 'all' && filteredTasks.length > 1 && (
          <ReorderButton 
            isActive={isDragModeEnabled}
            onPress={toggleDragMode}
          >
            <Ionicons 
              name={isDragModeEnabled ? "checkmark" : "reorder-three"} 
              size={20} 
              color={isDragModeEnabled ? "#FFFFFF" : theme.text} 
            />
            <ReorderText style={{ color: isDragModeEnabled ? "#FFFFFF" : theme.text }}>
              {isDragModeEnabled ? "Listo" : "Orden"}
            </ReorderText>
          </ReorderButton>
        )}

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
