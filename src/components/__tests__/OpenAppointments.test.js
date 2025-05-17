import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../store/slices/userSlice';
import appointmentsReducer from '../../store/slices/appointmentsSlice';
import OpenAppointments from '../OpenAppointments';

const mockAppointments = [
  {
    id: '1',
    patientName: 'John Doe',
    appointmentTime: '2025-05-20T10:00:00Z',
    status: 'OPEN'
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    appointmentTime: '2025-05-21T14:00:00Z',
    status: 'OPEN'
  }
];

const renderOpenAppointments = (appointments = mockAppointments) => {
  const store = configureStore({
    reducer: {
      user: userReducer,
      appointments: appointmentsReducer
    }
  });

  const handleCompleteDialogOpen = jest.fn();

  return {
    handleCompleteDialogOpen,
    ...render(
      <Provider store={store}>
        <Router>
          <OpenAppointments 
            classes={{}}
            appointmentsData={appointments}
            handleCompleteDialogOpen={handleCompleteDialogOpen}
          />
        </Router>
      </Provider>
    )
  };
};

describe('OpenAppointments', () => {
  it('should render a list of open appointments', () => {
    renderOpenAppointments();
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should handle empty appointments list', () => {
    renderOpenAppointments([]);
    
    expect(screen.getByText(/no open appointments/i)).toBeInTheDocument();
  });

  it('should call handleCompleteDialogOpen when complete button is clicked', async () => {
    const { handleCompleteDialogOpen } = renderOpenAppointments();
    
    const completeButton = screen.getAllByRole('button', { name: /complete/i })[0];
    fireEvent.click(completeButton);

    expect(handleCompleteDialogOpen).toHaveBeenCalledWith('1');
  });

  it('should display appointment time in correct format', () => {
    renderOpenAppointments();
    
    expect(screen.getByText('May 20, 2025 10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('May 21, 2025 2:00 PM')).toBeInTheDocument();
  });
});
