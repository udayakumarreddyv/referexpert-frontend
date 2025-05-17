import { useState, useCallback } from 'react';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

export const useNotification = () => {
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info', // 'error' | 'warning' | 'info' | 'success'
    autoHideDuration: 3000
  });

  const showNotification = useCallback(({ message, severity = 'info', autoHideDuration = 3000 }) => {
    setNotification({
      open: true,
      message,
      severity,
      autoHideDuration
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  const NotificationComponent = useCallback(() => (
    <Snackbar
      open={notification.open}
      autoHideDuration={notification.autoHideDuration}
      onClose={hideNotification}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
    >
      <Alert
        onClose={hideNotification}
        severity={notification.severity}
        variant="filled"
        elevation={6}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  ), [notification, hideNotification]);

  return {
    showNotification,
    hideNotification,
    NotificationComponent
  };
};

// Utility functions for common notification patterns
export const showSuccessNotification = (showNotification, message) => {
  showNotification({
    message,
    severity: 'success'
  });
};

export const showErrorNotification = (showNotification, message) => {
  showNotification({
    message,
    severity: 'error',
    autoHideDuration: 5000 // Show errors for longer
  });
};

export const showWarningNotification = (showNotification, message) => {
  showNotification({
    message,
    severity: 'warning',
    autoHideDuration: 4000
  });
};

export const showInfoNotification = (showNotification, message) => {
  showNotification({
    message,
    severity: 'info'
  });
};
