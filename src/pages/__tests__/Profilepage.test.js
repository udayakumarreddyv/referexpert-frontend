import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../store/slices/userSlice';
import Profilepage from '../Profilepage';

const mockUser = {
  loggedIn: true,
  token: 'mock-token',
  userDetails: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    officeName: 'Test Clinic',
    address: '123 Main St',
    city: 'Test City',
    state: 'CA',
    zip: '12345',
    phone: '(123) 456-7890',
    fax: '(123) 456-7891',
    userType: 'DOCTOR',
    userSpeciality: 'General',
    service: 'General Practice',
    insurance: 'All major insurance'
  }
};

const renderProfilePage = (initialState = mockUser) => {
  const store = configureStore({
    reducer: {
      user: userReducer
    },
    preloadedState: {
      user: initialState
    }
  });

  return render(
    <Provider store={store}>
      <Profilepage classes={{}} />
    </Provider>
  );
};

describe('Profilepage', () => {
  it('should render user details', () => {
    renderProfilePage();
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Test Clinic')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
  });

  it('should enable editing when edit button is clicked', async () => {
    renderProfilePage();
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Clinic')).toBeInTheDocument();
    });
  });

  it('should save changes when save button is clicked', async () => {
    renderProfilePage();
    
    // Click edit button
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Make changes
    const firstNameInput = screen.getByDisplayValue('John');
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });

    // Save changes
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  it('should validate required fields', async () => {
    renderProfilePage();
    
    // Click edit button
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Clear required field
    const firstNameInput = screen.getByDisplayValue('John');
    fireEvent.change(firstNameInput, { target: { value: '' } });

    // Try to save
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
  });

  it('should show notification methods dialog when button is clicked', async () => {
    renderProfilePage();
    
    const notificationButton = screen.getByRole('button', { name: /notification methods/i });
    fireEvent.click(notificationButton);

    await waitFor(() => {
      expect(screen.getByText(/notification methods/i)).toBeInTheDocument();
    });
  });
});
