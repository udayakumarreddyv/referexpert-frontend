import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pendingAppointments: [],
  openAppointments: [],
  completeAppointments: [],
  loading: false,
  error: null
};

export const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setPendingAppointments: (state, action) => {
      state.pendingAppointments = action.payload;
    },
    setOpenAppointments: (state, action) => {
      state.openAppointments = action.payload;
    },
    setCompleteAppointments: (state, action) => {
      state.completeAppointments = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetAppointments: (state) => {
      state.pendingAppointments = [];
      state.openAppointments = [];
      state.completeAppointments = [];
      state.loading = false;
      state.error = null;
    }
  }
});

export const {
  setPendingAppointments,
  setOpenAppointments,
  setCompleteAppointments,
  setLoading,
  setError,
  resetAppointments
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
