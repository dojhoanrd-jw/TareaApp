import { useCallback } from 'react';
import { Alert } from 'react-native';
import { AppError, ErrorType, errorHandler } from '../utils/ErrorHandler';

export const useErrorHandler = () => {
  const handleError = useCallback((
    error: Error | AppError,
    context?: string,
    showAlert: boolean = true
  ) => {
    const appError = error instanceof AppError 
      ? error 
      : new AppError(
          error.message || 'Error desconocido',
          ErrorType.UNKNOWN,
          'UNHANDLED_ERROR',
          { context, originalError: error }
        );

    errorHandler.handleError(appError, showAlert);
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    context?: string,
    onError?: (error: AppError) => void
  ): Promise<T | null> => {
    try {
      return await asyncOperation();
    } catch (error) {
      const appError = error instanceof AppError 
        ? error 
        : new AppError(
            error instanceof Error ? error.message : 'Error desconocido',
            ErrorType.UNKNOWN,
            'ASYNC_ERROR',
            { context, originalError: error }
          );

      errorHandler.logError(appError);
      
      if (onError) {
        onError(appError);
      } else {
        errorHandler.handleError(appError, true);
      }
      
      return null;
    }
  }, []);

  const showValidationError = useCallback((message: string) => {
    Alert.alert('Error de Validación', message, [
      { text: 'Entendido', style: 'default' }
    ]);
  }, []);

  return {
    handleError,
    handleAsyncError,
    showValidationError
  };
};
