import { useSwipeGesture } from './useSwipeGesture';

interface UseTaskCardProps {
  id: string;
  status?: 'completed' | 'in-progress';
  notificationsEnabled?: boolean;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onToggleNotifications?: (id: string) => void;
}

export const useTaskCard = ({
  id,
  status,
  notificationsEnabled,
  onDelete,
  onToggleStatus,
  onToggleNotifications,
}: UseTaskCardProps) => {
  const { pan, panResponder, resetPosition } = useSwipeGesture({
    actionWidth: 156,
    swipeThreshold: 50,
  });

  const actions = [
    {
      backgroundColor: '#FF6B6B',
      icon: 'trash',
      text: 'Eliminar',
      action: () => {
        resetPosition();
        onDelete?.(id);
      },
    },
    {
      backgroundColor: status === 'completed' ? '#4CAF50' : '#FF9800',
      icon: status === 'completed' ? 'checkmark' : 'play',
      text: status === 'completed' ? 'Hecho' : 'Progreso',
      action: () => {
        resetPosition();
        onToggleStatus?.(id);
      },
    },
  ];

  return {
    pan,
    panResponder,
    resetPosition,
    actions,
  };
};
