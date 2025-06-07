import React, { useRef } from 'react';
import { Animated, PanResponder, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import {
  CardWrapper,
  ActionsContainer,
  ActionButton,
  ActionText,
  CardContainer,
  TaskTitle,
  TaskDescription,
  TaskInfo,
  TimeContainer,
  TimeText,
  DaysContainer,
  DayChip,
  DayText,
  StatusBadge,
  StatusText,
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

const DAYS_MAP = {
  monday: 'L',
  tuesday: 'M',
  wednesday: 'M',
  thursday: 'J',
  friday: 'V',
  saturday: 'S',
  sunday: 'D',
};

const SWIPE_THRESHOLD = 60;
const ACTION_WIDTH = 156;

const TaskCard: React.FC<TaskCardProps> = ({
  id,
  title,
  description,
  days,
  startTime,
  endTime,
  user,
  status,
  notificationsEnabled = true,
  onPress,
  onDelete,
  onComplete,
  onToggleStatus,
  onToggleNotifications,
}) => {
  const theme = useTheme();
  const pan = useRef(new Animated.Value(0)).current;
  const lastOffset = useRef(0);
  const currentValue = useRef(0);

  // Track the animated value
  pan.addListener(({ value }) => {
    currentValue.current = value;
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 3;
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        pan.setOffset(lastOffset.current);
        pan.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx } = gestureState;
        const offset = lastOffset.current;
        let newValue = offset + dx;

        if (newValue > 0) {
          newValue = newValue * 0.2; 
        } else if (newValue < -ACTION_WIDTH) {
          const overflow = Math.abs(newValue + ACTION_WIDTH);
          newValue = -ACTION_WIDTH - overflow * 0.2; 
        }

        pan.setValue(newValue - offset);
      },
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();
        const finalValue = currentValue.current;
        lastOffset.current = finalValue;

        const { dx, vx } = gestureState;
        const velocity = Math.abs(vx);

        const shouldOpen =
          dx < -SWIPE_THRESHOLD ||
          (velocity > 0.5 && dx < 0) ||
          finalValue < -ACTION_WIDTH / 2;

        if (shouldOpen) {
          lastOffset.current = -ACTION_WIDTH;
          Animated.spring(pan, {
            toValue: -ACTION_WIDTH,
            useNativeDriver: false,
            tension: 120,
            friction: 8,
            velocity: vx,
          }).start();
        } else {
          lastOffset.current = 0;
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: false,
            tension: 120,
            friction: 8,
            velocity: vx,
          }).start();
        }
      },
    })
  ).current;

  const resetPosition = () => {
    lastOffset.current = 0;
    Animated.spring(pan, {
      toValue: 0,
      useNativeDriver: false,
      tension: 120,
      friction: 8,
    }).start();
  };

  const handleDelete = () => {
    onDelete?.(id);
    resetPosition();
  };

  const handleComplete = () => {
    onComplete?.(id);
    resetPosition();
  };

  const handleToggleStatus = () => {
    onToggleStatus?.(id);
    resetPosition();
  };

  const handleToggleNotifications = () => {
    onToggleNotifications?.(id);
    resetPosition();
  };

  return (
    <CardWrapper>
      <ActionsContainer>
        <ActionButton
          backgroundColor={notificationsEnabled ? '#FF9800' : '#4CAF50'}
          onPress={handleToggleNotifications}
        >
          <Ionicons
            name={notificationsEnabled ? 'notifications-off' : 'notifications'}
            size={18}
            color="#fff"
          />
          <ActionText>
            {notificationsEnabled ? 'Silenciar' : 'Activar'}
          </ActionText>
        </ActionButton>

        <ActionButton
          backgroundColor={status === 'in-progress' ? '#4CAF50' : '#FF9800'}
          onPress={handleToggleStatus}
        >
          <Ionicons
            name={status === 'in-progress' ? 'checkmark' : 'play'}
            size={20}
            color="#fff"
          />
          <ActionText>
            {status === 'in-progress' ? 'Completar' : 'Iniciar'}
          </ActionText>
        </ActionButton>

        <ActionButton
          backgroundColor="#F44336"
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <ActionText>Eliminar</ActionText>
        </ActionButton>
      </ActionsContainer>

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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <TaskTitle style={{ flex: 1 }}>{title}</TaskTitle>
            {notificationsEnabled && (
              <Ionicons 
                name="notifications" 
                size={16} 
                color={theme.primary} 
                style={{ marginLeft: 8 }}
              />
            )}
          </View>

          {description && (
            <TaskDescription>{description}</TaskDescription>
          )}

          <TaskInfo>
            <TimeContainer>
              <Ionicons name="time-outline" size={16} color={theme.primary} />
              <TimeText>
                {startTime} - {endTime}
              </TimeText>
              {status && (
                <StatusBadge status={status}>
                  <StatusText>
                    {status === 'completed' ? 'Completada' : 'En progreso'}
                  </StatusText>
                </StatusBadge>
              )}
            </TimeContainer>

            <DaysContainer>
              {days.map((day, index) => (
                <DayChip key={index}>
                  <DayText>{DAYS_MAP[day as keyof typeof DAYS_MAP]}</DayText>
                </DayChip>
              ))}
            </DaysContainer>
          </TaskInfo>
        </CardContainer>
      </Animated.View>
    </CardWrapper>
  );
};

export default TaskCard;
