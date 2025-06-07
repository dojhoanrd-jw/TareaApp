import { useEffect } from 'react';
import { Alert } from 'react-native';
import NotificationService from '../services/NotificationService';
import { useErrorHandler } from './useErrorHandler';
import { AppError, ErrorType } from '../utils/ErrorHandler';

export const useNotificationSetup = () => {
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const responseSubscription = NotificationService.addNotificationResponseListener(
          (response) => {
            try {
              const data = response.notification.request.content.data as any;
              if (data?.taskId) {
                Alert.alert(
                  'Recordatorio de tarea',
                  `${data.type === 'start' ? 'Tiempo de empezar' : 'Tiempo de finalizar'}: ${data.title}`
                );
              }
            } catch (error) {
              const appError = error instanceof AppError || error instanceof Error 
                ? error 
                : new AppError(
                    'Error procesando respuesta de notificación',
                    ErrorType.NOTIFICATION,
                    'NOTIFICATION_RESPONSE_ERROR',
                    { originalError: error }
                  );
              handleError(appError, 'Notification response handler');
            }
          }
        );

        const receivedSubscription = NotificationService.addNotificationReceivedListener(
          (notification) => {
            if (__DEV__) {
              console.log('Notification received:', notification);
            }
          }
        );

        return () => {
          responseSubscription.remove();
          receivedSubscription.remove();
        };
      } catch (error) {
        const appError = error instanceof AppError || error instanceof Error 
          ? error 
          : new AppError(
              'Error configurando notificaciones',
              ErrorType.NOTIFICATION,
              'NOTIFICATION_SETUP_ERROR',
              { originalError: error }
            );
        handleError(appError, 'Notification setup');
      }
    };

    setupNotifications();
  }, [handleError]);
};
