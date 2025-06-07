import React from 'react';
import { Animated } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useTaskCard } from '../../hooks/useTaskCard';
import TaskCardActions from './TaskCardActions';
import TaskCardContent from './TaskCardContent';
import {
  CardWrapper,
  CardContainer,
} from './styles';

interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  days: string[];
  startTime: string;
  endTime: string;
  user: string;
  status?: 'completed' | 'in-progress';
  notificationsEnabled?: boolean;
  onPress?: () => void;
  onDelete?: (id: string) => void;
  onComplete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onToggleNotifications?: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  days,
  startTime,
  endTime,
  status,
  notificationsEnabled = true,
  onPress,
  onDelete,
  onToggleStatus,
  onToggleNotifications,
}) => {
  const theme = useTheme();
  const { pan, panResponder, resetPosition, actions } = useTaskCard({
    id,
    status,
    notificationsEnabled,
    onDelete,
    onToggleStatus,
    onToggleNotifications,
  });

  return (
    <CardWrapper>
      <TaskCardActions actions={actions} />

      <Animated.View
        style={[
          {
            transform: [{ translateX: pan }],
            backgroundColor: theme.background,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            zIndex: 2,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <CardContainer
          onPress={onPress}
          activeOpacity={0.7}
          onLongPress={resetPosition}
        >
          <TaskCardContent
            title={title}
            description={description}
            days={days}
            startTime={startTime}
            endTime={endTime}
            status={status}
            notificationsEnabled={notificationsEnabled}
          />
        </CardContainer>
      </Animated.View>
    </CardWrapper>
  );
};

export default TaskCard;
