import { useCallback } from 'react';

interface UseTaskCardActionsProps {
  taskId: string;
  status?: 'completed' | 'in-progress';
  notificationsEnabled?: boolean;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onToggleNotifications?: (id: string) => void;
  onActionComplete?: () => void;
}

export const useTaskCardActions = ({
  taskId,
  status,
  notificationsEnabled,
  onDelete,
  onToggleStatus,
  onToggleNotifications,
  onActionComplete,
}: UseTaskCardActionsProps) => {
  const handleDelete = useCallback(() => {
    onDelete?.(taskId);
    onActionComplete?.();
  }, [taskId, onDelete, onActionComplete]);

  const handleToggleStatus = useCallback(() => {
    onToggleStatus?.(taskId);
    onActionComplete?.();
  }, [taskId, onToggleStatus, onActionComplete]);

  const handleToggleNotifications = useCallback(() => {
    onToggleNotifications?.(taskId);
    onActionComplete?.();
  }, [taskId, onToggleNotifications, onActionComplete]);

  const getStatusAction = () => ({
    backgroundColor: status === 'in-progress' ? '#4CAF50' : '#FF9800',
    icon: status === 'in-progress' ? 'checkmark' : 'play',
    text: status === 'in-progress' ? 'Completar' : 'Iniciar',
    action: handleToggleStatus,
  });

  const getNotificationAction = () => ({
    backgroundColor: notificationsEnabled ? '#FF9800' : '#4CAF50',
    icon: notificationsEnabled ? 'notifications-off' : 'notifications',
    text: notificationsEnabled ? 'Silenciar' : 'Activar',
    action: handleToggleNotifications,
  });

  const getDeleteAction = () => ({
    backgroundColor: '#F44336',
    icon: 'trash-outline' as const,
    text: 'Eliminar',
    action: handleDelete,
  });

  return {
    actions: [
      getNotificationAction(),
      getStatusAction(),
      getDeleteAction(),
    ],
  };
};
