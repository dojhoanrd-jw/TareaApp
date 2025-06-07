import React, { useCallback } from 'react';
import { Modal, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { useAuth } from '../../context/AuthContext';
import { TaskData } from '../../context/TaskContext';
import { useModalAnimation } from '../../hooks/useModalAnimation';
import { useTaskForm } from '../../hooks/useTaskForm';
import TaskForm from './components/TaskForm';
import Button from '../Button';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ScrollContainer,
  ButtonContainer,
  SmallButton,
} from './styles';

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateTask: (task: TaskData) => void;
  editTask?: TaskData;
  isEditMode?: boolean;
}

const TaskModal: React.FC<TaskModalProps> = ({ 
  visible, 
  onClose, 
  onCreateTask, 
  editTask,
  isEditMode = false 
}) => {
  const theme = useTheme();
  const { user } = useAuth();

  const { getBackdropStyle, getContentStyle, animateOut } = useModalAnimation({
    visible,
    animationType: 'slide',
    duration: 300,
  });

  const {
    title,
    description,
    selectedDays,
    startTime,
    endTime,
    notificationsEnabled,
    setTitle,
    setDescription,
    setStartTime,
    setEndTime,
    setNotificationsEnabled,
    toggleDay,
    formatTimeInput,
    handleSubmit,
  } = useTaskForm({
    editTask,
    isEditMode,
    onSubmit: onCreateTask,
    user,
  });

  const handleClose = useCallback(() => {
    animateOut(() => {
      onClose();
    });
  }, [onClose, animateOut]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      presentationStyle="overFullScreen"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Animated.View
          style={[
            {
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            getBackdropStyle(),
          ]}
        >
          <Animated.View
            style={[
              {
                width: '100%',
                maxHeight: '90%',
                backgroundColor: theme.background,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 10,
                paddingHorizontal: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 10,
              },
              getContentStyle(),
            ]}
          >
            <ModalHeader>
              <ModalTitle>{isEditMode ? 'Editar Tarea' : 'Nueva Tarea'}</ModalTitle>
              <CloseButton onPress={handleClose}>
                <Ionicons name="close" size={24} color={theme.text} />
              </CloseButton>
            </ModalHeader>

            <ScrollContainer 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                paddingBottom: 40,
              }}
            >
              <TaskForm
                title={title}
                description={description}
                selectedDays={selectedDays}
                startTime={startTime}
                endTime={endTime}
                notificationsEnabled={notificationsEnabled}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
                onDayToggle={toggleDay}
                onStartTimeChange={setStartTime}
                onEndTimeChange={setEndTime}
                onNotificationsToggle={setNotificationsEnabled}
                formatTimeInput={formatTimeInput}
              />
            </ScrollContainer>

            <ButtonContainer>
              <SmallButton>
                <Button text="Cancelar" onPress={handleClose} />
              </SmallButton>
              <SmallButton>
                <Button text={isEditMode ? 'Guardar' : 'Crear Tarea'} onPress={handleSubmit} />
              </SmallButton>
            </ButtonContainer>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default TaskModal;
