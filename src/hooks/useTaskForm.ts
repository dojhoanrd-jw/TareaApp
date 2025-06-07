import { useState, useEffect } from 'react';
import { TaskData } from '../context/TaskContext';
import { TaskValidationService } from '../services/TaskValidationService';
import { useErrorHandler } from './useErrorHandler';
import { AppError, ErrorType } from '../utils/ErrorHandler';

interface UseTaskFormProps {
  editTask?: TaskData;
  isEditMode?: boolean;
  onSubmit: (task: TaskData) => void;
  user?: { username: string } | null;
}

export const useTaskForm = ({ editTask, isEditMode = false, onSubmit, user }: UseTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationService = new TaskValidationService();
  const { handleError, showValidationError } = useErrorHandler();

  useEffect(() => {
    try {
      if (isEditMode && editTask) {
        setTitle(editTask.title || '');
        setDescription(editTask.description || '');
        setSelectedDays(editTask.days ? [...editTask.days] : []);
        setStartTime(editTask.startTime || '09:00');
        setEndTime(editTask.endTime || '17:00');
        setNotificationsEnabled(editTask.notificationsEnabled !== false);
      } else {
        resetForm();
      }
    } catch (error) {
      handleError(
        new AppError(
          'Error al cargar datos de tarea para edición',
          ErrorType.TASK,
          'TASK_LOAD_EDIT_ERROR',
          { editTask, isEditMode }
        ),
        'useTaskForm initialization'
      );
    }
  }, [isEditMode, editTask?.id]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedDays([]);
    setStartTime('09:00');
    setEndTime('17:00');
    setNotificationsEnabled(true);
    setIsSubmitting(false);
  };

  const toggleDay = (dayKey: string) => {
    try {
      setSelectedDays(prev => 
        prev.includes(dayKey) 
          ? prev.filter(d => d !== dayKey)
          : [...prev, dayKey]
      );
    } catch (error) {
      handleError(
        new AppError(
          'Error al actualizar días seleccionados',
          ErrorType.TASK,
          'DAY_TOGGLE_ERROR',
          { dayKey, selectedDays }
        ),
        'toggleDay'
      );
    }
  };

  const formatTimeInput = (text: string, setter: (value: string) => void) => {
    try {
      let cleaned = text.replace(/[^\d:]/g, '');
      
      if (cleaned.length === 2 && !cleaned.includes(':')) {
        cleaned += ':';
      }
      
      if (cleaned.length > 5) {
        cleaned = cleaned.substring(0, 5);
      }

      setter(cleaned);
    } catch (error) {
      handleError(
        new AppError(
          'Error al formatear entrada de tiempo',
          ErrorType.VALIDATION,
          'TIME_FORMAT_ERROR',
          { text, originalError: error }
        ),
        'formatTimeInput'
      );
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (!user?.username) {
        throw new AppError(
          'Usuario no autenticado',
          ErrorType.AUTHENTICATION,
          'USER_NOT_AUTHENTICATED'
        );
      }

      const validation = validationService.validateTask({
        title,
        days: selectedDays,
        startTime,
        endTime,
      });

      if (!validation.isValid) {
        showValidationError(validation.error || 'Error de validación desconocido');
        return;
      }

      const taskData: TaskData = {
        id: isEditMode && editTask ? editTask.id : Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        days: selectedDays,
        startTime,
        endTime,
        user: user.username,
        status: isEditMode && editTask ? editTask.status : undefined,
        notificationsEnabled,
      };

      await onSubmit(taskData);
    } catch (error) {
      if (error instanceof AppError) {
        handleError(error, 'Task form submission');
      } else {
        handleError(
          new AppError(
            'Error inesperado al enviar formulario de tarea',
            ErrorType.TASK,
            'TASK_SUBMIT_ERROR',
            { 
              title, 
              selectedDays, 
              startTime, 
              endTime, 
              isEditMode,
              originalError: error 
            }
          ),
          'Task form submission'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // State
    title,
    description,
    selectedDays,
    startTime,
    endTime,
    notificationsEnabled,
    isSubmitting,
    
    // Actions
    setTitle,
    setDescription,
    setSelectedDays,
    setStartTime,
    setEndTime,
    setNotificationsEnabled,
    toggleDay,
    formatTimeInput,
    handleSubmit,
    resetForm,
  };
};
