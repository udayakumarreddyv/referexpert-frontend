import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../store/slices/userSlice';
import { useAuth } from './useAuth';

const setupTest = () => {
  const store = configureStore({
    reducer: {
      user: userReducer
    }
  });

  const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
  );

  return {
    store,
    ...renderHook(() => useAuth(), { wrapper })
  };
};

describe('useAuth hook', () => {
  it('should handle successful login', async () => {
    const { result, store } = setupTest();

    await act(async () => {
      await result.current.login({
        accessToken: 'test-token',
        refreshToken: 'test-refresh'
      });
    });

    const state = store.getState().user;
    expect(state.loggedIn).toBe(true);
    expect(state.token).toBe('test-token');
  });

  it('should handle logout', async () => {
    const { result, store } = setupTest();

    // First login
    await act(async () => {
      await result.current.login({
        accessToken: 'test-token',
        refreshToken: 'test-refresh'
      });
    });

    // Then logout
    act(() => {
      result.current.logout();
    });

    const state = store.getState().user;
    expect(state.loggedIn).toBe(false);
    expect(state.token).toBeNull();
  });
});
