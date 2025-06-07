import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { ActionsContainer, ActionButton, ActionText } from './styles';

interface TaskAction {
  backgroundColor: string;
  icon: string;
  text: string;
  action: () => void;
}

interface TaskCardActionsProps {
  actions: TaskAction[];
}

const TaskCardActions: React.FC<TaskCardActionsProps> = ({ actions }) => {
  return (
    <ActionsContainer>
      {actions.map((action, index) => (
        <ActionButton
          key={index}
          backgroundColor={action.backgroundColor}
          onPress={action.action}
        >
          <Ionicons
            name={action.icon as any}
            size={action.icon === 'checkmark' || action.icon === 'play' ? 20 : 18}
            color="#fff"
          />
          <ActionText>{action.text}</ActionText>
        </ActionButton>
      ))}
    </ActionsContainer>
  );
};

export default TaskCardActions;
