export interface ITaskValidationService {
  validateTitle(title: string): { isValid: boolean; error?: string };
  validateDays(days: string[]): { isValid: boolean; error?: string };
  validateTime(time: string): { isValid: boolean; error?: string };
  validateTimeRange(startTime: string, endTime: string): { isValid: boolean; error?: string };
  validateTask(data: { title: string; days: string[]; startTime: string; endTime: string }): { isValid: boolean; error?: string };
}

export class TaskValidationService implements ITaskValidationService {
  validateTitle(title: string): { isValid: boolean; error?: string } {
    if (!title.trim()) {
      return { isValid: false, error: 'El título de la tarea es obligatorio' };
    }
    return { isValid: true };
  }

  validateDays(days: string[]): { isValid: boolean; error?: string } {
    if (days.length === 0) {
      return { isValid: false, error: 'Debes seleccionar al menos un día' };
    }
    return { isValid: true };
  }

  validateTime(time: string): { isValid: boolean; error?: string } {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return { isValid: false, error: 'Las horas deben tener formato HH:MM válido' };
    }
    return { isValid: true };
  }

  validateTimeRange(startTime: string, endTime: string): { isValid: boolean; error?: string } {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    
    if (startH * 60 + startM >= endH * 60 + endM) {
      return { isValid: false, error: 'La hora de inicio debe ser anterior a la hora de fin' };
    }
    return { isValid: true };
  }

  validateTask(data: { title: string; days: string[]; startTime: string; endTime: string }): { isValid: boolean; error?: string } {
    const titleValidation = this.validateTitle(data.title);
    if (!titleValidation.isValid) return titleValidation;

    const daysValidation = this.validateDays(data.days);
    if (!daysValidation.isValid) return daysValidation;

    const startTimeValidation = this.validateTime(data.startTime);
    if (!startTimeValidation.isValid) return startTimeValidation;

    const endTimeValidation = this.validateTime(data.endTime);
    if (!endTimeValidation.isValid) return endTimeValidation;

    const timeRangeValidation = this.validateTimeRange(data.startTime, data.endTime);
    if (!timeRangeValidation.isValid) return timeRangeValidation;

    return { isValid: true };
  }
}
