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

// Service for logging errors
class ErrorLogger {
  logError(error: AppError): void {
    // Log to console in development
    if (__DEV__) {
      console.error('Error logged:', {
        message: error.message,
        type: error.type,
        code: error.code,
        details: error.details,
        stack: error.stack,
        timestamp: error.timestamp
      });
    }

    // Here you could send to crash reporting service like Crashlytics, Sentry, etc.
    // this.sendToCrashReporting(error);
  }
}

// Service for converting generic errors to AppErrors
class ErrorConverter {
  convertToAppError(error: Error): AppError {
    return new AppError(
      error.message || 'Error desconocido',
      ErrorType.UNKNOWN,
      undefined,
      { originalError: error.name }
    );
  }
}

// Service for storing errors
class ErrorStorage {
  private errors: AppError[] = [];

  storeError(error: AppError): void {
    this.errors.push(error);
  }

  getRecentErrors(limit: number = 10): AppError[] {
    return this.errors.slice(-limit);
  }

  clearErrors(): void {
    this.errors = [];
  }
}

// Service for showing error alerts
class ErrorAlertService {
  showErrorAlert(error: AppError): void {
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
}

// Main ErrorHandler - orchestrates other services
export class ErrorHandler {
  private static instance: ErrorHandler;
  private logger: ErrorLogger;
  private converter: ErrorConverter;
  private storage: ErrorStorage;
  private alertService: ErrorAlertService;

  private constructor() {
    this.logger = new ErrorLogger();
    this.converter = new ErrorConverter();
    this.storage = new ErrorStorage();
    this.alertService = new ErrorAlertService();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  logError(error: AppError | Error): void {
    const appError = error instanceof AppError ? error : this.converter.convertToAppError(error);
    
    this.storage.storeError(appError);
    this.logger.logError(appError);
  }

  handleError(error: AppError | Error, showAlert: boolean = true): void {
    const appError = error instanceof AppError ? error : this.converter.convertToAppError(error);
    
    this.logError(appError);

    if (showAlert) {
      this.alertService.showErrorAlert(appError);
    }
  }

  getRecentErrors(limit: number = 10): AppError[] {
    return this.storage.getRecentErrors(limit);
  }

  clearErrors(): void {
    this.storage.clearErrors();
  }
}

export const errorHandler = ErrorHandler.getInstance();
