import { renderHook, act } from '@testing-library/react-hooks';
import { useNotification } from '../useNotification';

describe('useNotification', () => {
  it('should show and hide notifications', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.showNotification({
        message: 'Test message',
        severity: 'success'
      });
    });

    const NotificationComponent = result.current.NotificationComponent;
    expect(NotificationComponent).toBeDefined();

    act(() => {
      result.current.hideNotification();
    });
  });

  it('should use default values', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.showNotification({
        message: 'Test message'
      });
    });

    // Default severity should be 'info'
    const NotificationComponent = result.current.NotificationComponent;
    const rendered = NotificationComponent();
    expect(rendered.props.children.props.severity).toBe('info');
  });

  it('should handle custom autoHideDuration', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.showNotification({
        message: 'Test message',
        autoHideDuration: 5000
      });
    });

    const NotificationComponent = result.current.NotificationComponent;
    const rendered = NotificationComponent();
    expect(rendered.props.autoHideDuration).toBe(5000);
  });

  it('should handle multiple notifications', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.showNotification({
        message: 'First message',
        severity: 'success'
      });
    });

    act(() => {
      result.current.showNotification({
        message: 'Second message',
        severity: 'error'
      });
    });

    const NotificationComponent = result.current.NotificationComponent;
    const rendered = NotificationComponent();
    expect(rendered.props.children.props.severity).toBe('error');
    expect(rendered.props.children.props.children).toBe('Second message');
  });
});
