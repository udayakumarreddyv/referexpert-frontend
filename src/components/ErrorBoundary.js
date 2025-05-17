import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  errorContainer: {
    padding: theme.spacing(3),
    textAlign: 'center',
    maxWidth: '600px',
    margin: '40px auto',
  },
  title: {
    color: theme.palette.error.main,
    marginBottom: theme.spacing(2),
  },
  message: {
    marginBottom: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

function ErrorFallback({ error, onReset }) {
  const classes = useStyles();

  return (
    <div className={classes.errorContainer}>
      <h2 className={classes.title}>Something went wrong</h2>
      <div className={classes.message}>
        We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
      </div>
      {error?.message && (
        <div className={classes.message}>
          Error details: {error.message}
        </div>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={onReset}
        className={classes.button}
      >
        Try Again
      </Button>
    </div>
  );
}

export default ErrorBoundary;
