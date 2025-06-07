import React from 'react';
import { Platform, KeyboardAvoidingView } from 'react-native';
import { TaskData } from '../../context/TaskContext';
import Modal from '../Modal';
import TaskDetails from './components/TaskDetails';
import Button from '../Button';
import { ButtonContainer, ActionButton } from './styles';

interface TaskViewProps {
  visible: boolean;
  task: TaskData | null;
  onClose: () => void;
  onEdit: (task: TaskData) => void;
}

const TaskView: React.FC<TaskViewProps> = ({ visible, task, onClose, onEdit }) => {
  if (!task) return null;

  const handleEdit = () => {
    onEdit(task);
    onClose();
  };

  const footer = (
    <ButtonContainer>
      <ActionButton>
        <Button text="Cerrar" onPress={onClose} />
      </ActionButton>
      <ActionButton>
        <Button text="Editar Tarea" onPress={handleEdit} />
      </ActionButton>
    </ButtonContainer>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Modal
        visible={visible}
        title="Detalles de Tarea"
        onClose={onClose}
        footer={footer}
        animationType="slide"
        keyboardAvoidingView={false}
      >
        <TaskDetails task={task} />
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default TaskView;
