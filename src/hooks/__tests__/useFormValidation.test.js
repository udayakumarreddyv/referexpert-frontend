import { renderHook, act } from '@testing-library/react-hooks';
import { useFormValidation } from '../useFormValidation';

describe('useFormValidation', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFormValidation({
      email: '',
      password: ''
    }));

    expect(result.current.values).toEqual({
      email: '',
      password: ''
    });
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should handle field changes and clear errors', () => {
    const { result } = renderHook(() => useFormValidation({
      email: '',
      password: ''
    }));

    act(() => {
      result.current.handleChange('email', 'test@example.com');
    });

    expect(result.current.values.email).toBe('test@example.com');
  });

  it('should validate email field', () => {
    const { result } = renderHook(() => useFormValidation({
      email: 'invalid-email'
    }));

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors.email).toBe('Please enter a valid email');
  });

  it('should validate password field', () => {
    const { result } = renderHook(() => useFormValidation({
      password: '123'
    }));

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors.password).toBe('Password must be at least 8 characters');
  });

  it('should reset form state', () => {
    const initialValues = {
      email: '',
      password: ''
    };

    const { result } = renderHook(() => useFormValidation(initialValues));

    act(() => {
      result.current.handleChange('email', 'test@example.com');
      result.current.handleChange('password', 'password123');
      result.current.setErrors({ email: 'Invalid email' });
      result.current.setIsSubmitting(true);
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should validate phone numbers correctly', () => {
    const { result } = renderHook(() => useFormValidation({
      phone: '123'
    }));

    act(() => {
      result.current.validateForm();
    });

    expect(result.current.errors.phone).toBe('Please enter a valid phone number');

    act(() => {
      result.current.handleChange('phone', '+1 (123) 456-7890');
      result.current.validateForm();
    });

    expect(result.current.errors.phone).toBeUndefined();
  });
});
