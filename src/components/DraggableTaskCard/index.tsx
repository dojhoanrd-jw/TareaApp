import React, { useRef } from 'react';
import { Animated, PanResponder, View } from 'react-native';
import { TaskData } from '../../context/TaskContext';
import TaskCard from '../TaskCard';
import {
  DragHandle,
  DragIndicator,
  DraggableContainer,
  TaskCardContainer,
} from './styles';

interface DraggableTaskCardProps {
  task: TaskData;
  index: number;
  isDragEnabled: boolean;
  style?: any;
  onDragStart: (index: number) => void;
  onDragMove: (gestureY: number) => void;
  onDragEnd: () => void;
  onPress?: () => void;
  onDelete?: (id: string) => void;
  onComplete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onToggleNotifications?: (id: string) => void;
}

const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({
  task,
  index,
  isDragEnabled,
  style,
  onDragStart,
  onDragMove,
  onDragEnd,
  onPress,
  onDelete,
  onComplete,
  onToggleStatus,
  onToggleNotifications,
}) => {
  const pan = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => isDragEnabled,
      onPanResponderGrant: () => {
        if (isDragEnabled) {
          onDragStart(index);
        }
      },
      onPanResponderMove: (_, gestureState) => {
        if (isDragEnabled) {
          pan.setValue(gestureState.dy);
          onDragMove(gestureState.dy);
        }
      },
      onPanResponderRelease: () => {
        if (isDragEnabled) {
          onDragEnd();
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View style={[{ width: '100%' }, style]}>
      <DraggableContainer>
        {isDragEnabled && (
          <View {...panResponder.panHandlers}>
            <DragHandle>
              <DragIndicator />
              <DragIndicator />
              <DragIndicator />
            </DragHandle>
          </View>
        )}

        <TaskCardContainer>
          <TaskCard
            id={task.id}
            title={task.title}
            description={task.description}
            days={task.days}
            startTime={task.startTime}
            endTime={task.endTime}
            user={task.user}
            status={task.status}
            notificationsEnabled={task.notificationsEnabled}
            onPress={onPress}
            onDelete={onDelete}
            onComplete={onComplete}
            onToggleStatus={onToggleStatus}
            onToggleNotifications={onToggleNotifications}
          />
        </TaskCardContainer>
      </DraggableContainer>
    </Animated.View>
  );
};

export default DraggableTaskCard;
