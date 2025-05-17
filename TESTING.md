# Testing Guide

This document provides guidelines and examples for testing the ReferExpert frontend application.

## Testing Stack

- Jest
- React Testing Library
- MSW (Mock Service Worker) for API mocking
- jest-fetch-mock for fetch requests
- @testing-library/user-event for user interactions

## Test Directory Structure

```
src/
├── components/
│   └── __tests__/    # Component tests
├── hooks/
│   └── __tests__/    # Hook tests
├── pages/
│   └── __tests__/    # Page tests
└── mocks/            # Mock data and servers
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- LoginCard.test.js

# Run tests in watch mode
npm test -- --watch
```

## Types of Tests

### Unit Tests

Test individual components, hooks, and utility functions in isolation.

Example Component Test:
```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginCard from '../LoginCard';

describe('LoginCard', () => {
  it('should show validation error for invalid email', async () => {
    render(<LoginCard />);
    
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');
    
    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
  });
});
```

Example Hook Test:
```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import useFormValidation from '../useFormValidation';

describe('useFormValidation', () => {
  it('should validate required fields', () => {
    const { result } = renderHook(() => useFormValidation({
      email: '', 
      password: ''
    }));
    
    act(() => {
      result.current.validateField('email');
    });
    
    expect(result.current.errors.email).toBe('Email is required');
  });
});
```

### Integration Tests

Test component interactions, form submissions, and API integrations.

Example:
```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Referrals from '../Referrals';

const server = setupServer(
  rest.get('/api/referrals', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, patient: 'John Doe', status: 'pending' }
    ]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('loads and displays referrals', async () => {
  render(<Referrals />);
  
  await waitFor(() => {
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### Redux Tests

Test Redux actions, reducers, and selectors.

Example:
```javascript
import { configureStore } from '@reduxjs/toolkit';
import userReducer, { setUser } from '../userSlice';

describe('userSlice', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: { user: userReducer }
    });
  });

  it('should handle setUser', () => {
    store.dispatch(setUser({ id: 1, name: 'John' }));
    
    const state = store.getState().user;
    expect(state.currentUser).toEqual({ id: 1, name: 'John' });
  });
});
```

## Best Practices

1. Test Component Behavior
   - Test what the user sees and interacts with
   - Use queries that reflect how users find elements
   - Test accessibility where applicable

2. Mock External Dependencies
   - Use MSW for API calls
   - Mock complex browser APIs
   - Isolate tests from external state

3. Test Error Handling
   - Test loading states
   - Test error messages
   - Test edge cases and boundary conditions

4. Write Maintainable Tests
   - Use clear test descriptions
   - Follow the Arrange-Act-Assert pattern
   - Keep tests focused and simple

## Coverage Requirements

- Minimum coverage: 80%
- Critical paths: 100%
- New features: 90%

Run coverage reports with:
```bash
npm run test:coverage
```

## Debugging Tests

1. Use console.log in tests (removed in CI)
2. Use screen.debug() to view component state
3. Use jest.setTimeout() for async tests
4. Use test.only() to run specific tests

## Continuous Integration

Tests are run automatically on:
- Pull requests
- Merges to main branch
- Release tags

Failed tests will block merges to protected branches.
