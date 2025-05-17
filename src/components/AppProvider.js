import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from '../store/store';
import ErrorBoundary from './ErrorBoundary';

// Material UI
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1261a0',
      dark: '#0a4184',
    },
    secondary: {
      main: '#ff6961',
      dark: '#ff5148',
    },
    error: {
      main: '#ff6961',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function AppProvider({ children }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <Router>
            {children}
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  );
}

export default AppProvider;
