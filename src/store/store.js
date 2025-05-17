import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import appointmentsReducer from './slices/appointmentsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    appointments: appointmentsReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false // Disable serializable check for non-serializable data
    })
});

// Export the store's state and dispatch types for components
export const getState = store.getState;
export const dispatch = store.dispatch;
