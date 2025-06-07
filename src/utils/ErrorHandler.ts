import { Alert } from 'react-native';

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  NETWORK = 'NETWORK',
  STORAGE = 'STORAGE',
  AUTHENTICATION = 'AUTHENTICATION',
  NOTIFICATION = 'NOTIFICATION',
  TASK = 'TASK',
  UNKNOWN = 'UNKNOWN'
}

export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly code?: string;
  public readonly details?: any;
  public readonly timestamp: Date;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    code?: string,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errors: AppError[] = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  logError(error: AppError | Error): void {
    const appError = error instanceof AppError ? error : this.convertToAppError(error);
    
    this.errors.push(appError);
    
    // Log to console in development
    if (__DEV__) {
      console.error('Error logged:', {
        message: appError.message,
        type: appError.type,
        code: appError.code,
        details: appError.details,
        stack: appError.stack,
        timestamp: appError.timestamp
      });
    }

    // Here you could send to crash reporting service like Crashlytics, Sentry, etc.
    // this.sendToCrashReporting(appError);
  }

  private convertToAppError(error: Error): AppError {
    return new AppError(
      error.message || 'Error desconocido',
      ErrorType.UNKNOWN,
      undefined,
      { originalError: error.name }
    );
  }

  handleError(error: AppError | Error, showAlert: boolean = true): void {
    const appError = error instanceof AppError ? error : this.convertToAppError(error);
    
    this.logError(appError);

    if (showAlert) {
      this.showErrorAlert(appError);
    }
  }

  private showErrorAlert(error: AppError): void {
    const title = this.getErrorTitle(error.type);
    const message = this.getUserFriendlyMessage(error);

    Alert.alert(title, message, [
      { text: 'Entendido', style: 'default' }
    ]);
  }

  private getErrorTitle(type: ErrorType): string {
    switch (type) {
      case ErrorType.VALIDATION:
        return 'Error de Validación';
      case ErrorType.NETWORK:
        return 'Error de Conexión';
      case ErrorType.STORAGE:
        return 'Error de Almacenamiento';
      case ErrorType.AUTHENTICATION:
        return 'Error de Autenticación';
      case ErrorType.NOTIFICATION:
        return 'Error de Notificación';
      case ErrorType.TASK:
        return 'Error de Tarea';
      default:
        return 'Error';
    }
  }

  private getUserFriendlyMessage(error: AppError): string {
    // Return the original message if it's user-friendly, otherwise provide a generic one
    switch (error.type) {
      case ErrorType.NETWORK:
        return 'Revisa tu conexión a internet e intenta nuevamente.';
      case ErrorType.STORAGE:
        return 'No se pudo acceder al almacenamiento. Verifica que la aplicación tenga permisos.';
      case ErrorType.AUTHENTICATION:
        return error.message || 'Error de autenticación. Intenta iniciar sesión nuevamente.';
      case ErrorType.NOTIFICATION:
        return 'No se pudieron configurar las notificaciones. Verifica los permisos.';
      default:
        return error.message || 'Ha ocurrido un error inesperado.';
    }
  }

  getRecentErrors(limit: number = 10): AppError[] {
    return this.errors.slice(-limit);
  }

  clearErrors(): void {
    this.errors = [];
  }
}

export const errorHandler = ErrorHandler.getInstance();
