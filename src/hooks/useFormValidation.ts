import { useState, useCallback } from 'react';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface FieldValidation {
  [key: string]: ValidationRules;
}

export const useFormValidation = (rules: FieldValidation) => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = useCallback((fieldName: string, value: string): string | null => {
    const fieldRules = rules[fieldName];
    if (!fieldRules) return null;

    if (fieldRules.required && !value.trim()) {
      return 'Este campo es requerido';
    }

    if (fieldRules.minLength && value.length < fieldRules.minLength) {
      return `Mínimo ${fieldRules.minLength} caracteres`;
    }

    if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
      return `Máximo ${fieldRules.maxLength} caracteres`;
    }

    if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
      return 'Formato inválido';
    }

    if (fieldRules.custom) {
      return fieldRules.custom(value);
    }

    return null;
  }, [rules]);

  const validateForm = useCallback((formData: { [key: string]: string }): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    Object.keys(rules).forEach(fieldName => {
      const error = validateField(fieldName, formData[fieldName] || '');
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [rules, validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    clearFieldError,
  };
};
