import { useState, useCallback } from 'react';
import * as EmailValidator from 'email-validator';

export const useFormValidation = (initialState = {}) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const validateField = useCallback((name, value) => {
    let error = null;
    
    switch (name) {
      case 'email':
        if (!EmailValidator.validate(value)) {
          error = 'Please enter a valid email';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        }
        break;
      case 'firstName':
      case 'lastName':
      case 'officeName':
        if (!value?.trim()) {
          error = `${name} is required`;
        }
        break;
      case 'phone':
        if (value && !/^\+?[\d\s-]{10,}$/.test(value)) {
          error = 'Please enter a valid phone number';
        }
        break;
      default:
        if (value === '' || value === null || value === undefined) {
          error = `${name} is required`;
        }
    }
    
    return error;
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(values).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validateField]);

  const resetForm = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setIsSubmitting(false);
  }, [initialState]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    validateForm,
    resetForm,
    setIsSubmitting,
    setErrors,
    setValues
  };
};
