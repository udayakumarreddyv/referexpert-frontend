import { renderHook } from '@testing-library/react-hooks';
import { useAsync } from '../useAsync';

describe('useAsync', () => {
  it('should handle successful async operations', async () => {
    const successFn = jest.fn().mockResolvedValue('success');
    const { result, waitForNextUpdate } = renderHook(() => useAsync(successFn));

    expect(result.current.status).toBe('idle');

    result.current.execute();

    expect(result.current.status).toBe('pending');
    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.status).toBe('success');
    expect(result.current.data).toBe('success');
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(true);
  });

  it('should handle failed async operations', async () => {
    const error = new Error('Test error');
    const failureFn = jest.fn().mockRejectedValue(error);
    const { result, waitForNextUpdate } = renderHook(() => useAsync(failureFn));

    result.current.execute();

    expect(result.current.status).toBe('pending');

    await waitForNextUpdate();

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBe(error);
    expect(result.current.data).toBeNull();
    expect(result.current.isError).toBe(true);
  });

  it('should handle multiple executions', async () => {
    const successFn = jest.fn()
      .mockResolvedValueOnce('first')
      .mockResolvedValueOnce('second');
    
    const { result, waitForNextUpdate } = renderHook(() => useAsync(successFn));

    result.current.execute();
    await waitForNextUpdate();
    expect(result.current.data).toBe('first');

    result.current.execute();
    await waitForNextUpdate();
    expect(result.current.data).toBe('second');
  });

  it('should pass parameters to async function', async () => {
    const successFn = jest.fn().mockResolvedValue('success');
    const { result, waitForNextUpdate } = renderHook(() => useAsync(successFn));

    result.current.execute('param1', 'param2');
    await waitForNextUpdate();

    expect(successFn).toHaveBeenCalledWith('param1', 'param2');
  });

  it('should reset state between executions', async () => {
    const successFn = jest.fn().mockResolvedValue('success');
    const { result, waitForNextUpdate } = renderHook(() => useAsync(successFn));

    result.current.execute();
    await waitForNextUpdate();

    expect(result.current.status).toBe('success');

    result.current.execute();
    
    expect(result.current.status).toBe('pending');
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
