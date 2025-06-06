import React from 'react';
import { Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { TaskData } from '../../context/TaskContext';
import { useModalAnimation } from '../../hooks/useModalAnimation';
import Button from '../Button';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ScrollContainer,
  Section,
  SectionTitle,
  SectionContent,
  DaysContainer,
  DayChip,
  DayText,
  TimeContainer,
  TimeText,
  ButtonContainer,
  ActionButton,
} from './styles';

interface TaskViewProps {
  visible: boolean;
  task: TaskData | null;
  onClose: () => void;
  onEdit: (task: TaskData) => void;
}

const DAYS_NAMES = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

const TaskView: React.FC<TaskViewProps> = ({ visible, task, onClose, onEdit }) => {
  const theme = useTheme();

  const { getBackdropStyle, getContentStyle, animateOut } = useModalAnimation({
    visible,
    animationType: 'slide',
    duration: 300,
  });

  if (!task) return null;

  const handleEdit = () => {
    onEdit(task);
    onClose();
  };

  const handleClose = () => {
    animateOut(() => {
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
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
              maxHeight: '85%',
              backgroundColor: theme.background,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
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
            <ModalTitle>Detalles de Tarea</ModalTitle>
            <CloseButton onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.text} />
            </CloseButton>
          </ModalHeader>

          <ScrollContainer showsVerticalScrollIndicator={false}>
            <Section>
              <SectionTitle>Título</SectionTitle>
              <SectionContent>{task.title}</SectionContent>
            </Section>

            {task.description && (
              <Section>
                <SectionTitle>Descripción</SectionTitle>
                <SectionContent>{task.description}</SectionContent>
              </Section>
            )}

            <Section>
              <SectionTitle>Días de la semana</SectionTitle>
              <DaysContainer>
                {task.days.map((day, index) => (
                  <DayChip key={index}>
                    <DayText>{DAYS_NAMES[day as keyof typeof DAYS_NAMES]}</DayText>
                  </DayChip>
                ))}
              </DaysContainer>
            </Section>

            <Section>
              <SectionTitle>Horario</SectionTitle>
              <TimeContainer>
                <Ionicons name="time-outline" size={20} color={theme.primary} />
                <TimeText>{task.startTime} - {task.endTime}</TimeText>
              </TimeContainer>
            </Section>
          </ScrollContainer>

          <ButtonContainer>
            <ActionButton>
              <Button text="Cerrar" onPress={onClose} />
            </ActionButton>
            <ActionButton>
              <Button text="Editar Tarea" onPress={handleEdit} />
            </ActionButton>
          </ButtonContainer>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default TaskView;
