import { useSwipeGesture } from './useSwipeGesture';
import { useTaskCardActions } from './useTaskCardActions';

interface UseTaskCardProps {
  id: string;
  status?: 'completed' | 'in-progress';
  notificationsEnabled?: boolean;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onToggleNotifications?: (id: string) => void;
}

const SWIPE_THRESHOLD = 60;
const ACTION_WIDTH = 156;

export const useTaskCard = ({
  id,
  status,
  notificationsEnabled = true,
  onDelete,
  onToggleStatus,
  onToggleNotifications,
}: UseTaskCardProps) => {
  const { pan, panResponder, resetPosition } = useSwipeGesture({
    actionWidth: ACTION_WIDTH,
    swipeThreshold: SWIPE_THRESHOLD,
  });

  const { actions } = useTaskCardActions({
    taskId: id,
    status,
    notificationsEnabled,
    onDelete,
    onToggleStatus,
    onToggleNotifications,
    onActionComplete: () => resetPosition(),
  });

  return {
    pan,
    panResponder,
    resetPosition,
    actions,
  };
};
