import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../store/slices/userSlice';
import PrivateRoute from '../components/PrivateRoute';

const TestComponent = () => <div>Test Component</div>;

const renderPrivateRoute = (initialState = {}) => {
  const store = configureStore({
    reducer: {
      user: userReducer
    },
    preloadedState: {
      user: {
        loggedIn: false,
        ...initialState
      }
    }
  });

  return render(
    <Provider store={store}>
      <Router>
        <PrivateRoute
          path="/test"
          component={TestComponent}
          classes={{}}
        />
      </Router>
    </Provider>
  );
};

describe('PrivateRoute', () => {
  it('should redirect to login when not authenticated', () => {
    renderPrivateRoute();
    expect(window.location.pathname).toBe('/signIn');
  });

  it('should render component when authenticated', () => {
    renderPrivateRoute({ loggedIn: true });
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });
});
