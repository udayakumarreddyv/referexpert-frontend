# ReferExpert Frontend

The frontend application for the ReferExpert medical referral management system built with React and Material-UI.

## Features

- User Authentication
  - Login/Register with email verification
  - Secure password reset flow
  - Profile management with detailed user information
- Appointment Management
  - Create and track appointments in real-time
  - View complete/pending appointments
  - Availability management system
  - Automated notifications
- Referral System
  - Create and manage patient referrals
  - Doctor invitations and onboarding
  - Patient time management and scheduling
  - Status tracking and updates
- Real-time Notifications
  - Customizable notification methods (email, SMS)
  - Instant appointment updates
  - Referral status change alerts
  - System notifications
- Administrative Functions
  - User management and access control
  - System settings and configuration
  - Support contact management
  - Activity monitoring

## Tech Stack

- **Frontend Framework**: React 17
- **State Management**: Redux Toolkit
- **UI Components**: Material-UI v4
- **Form Handling**: Custom hooks with validation
- **API Integration**: Fetch API with custom client
- **Testing**: Jest & React Testing Library
- **Authentication**: JWT with refresh token rotation

## Project Structure

```
src/
├── api/          # API integration layer
│   ├── client.js # Base API client
│   └── ...       # API endpoint modules
├── components/   # Reusable UI components
│   ├── __tests__/ # Component tests
│   └── styles/    # Component styles
├── hooks/       # Custom React hooks
│   └── __tests__/ # Hook tests
├── pages/       # Page components
│   ├── __tests__/ # Page tests
│   └── styles/    # Page styles
├── store/       # Redux store configuration
│   └── slices/    # Redux slices
├── utils/       # Helper functions
└── mocks/       # Test mocks
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or Yarn
- Backend server running (see main project README)

## Setup and Installation

1. Clone the repository:
```powershell
git clone <repository-url>
cd referexpert-frontend
```

2. Install dependencies:
```powershell
npm install
# or
yarn install
```

3. Create a .env file in the root directory:
```env
REACT_APP_API_URL=http://localhost:8081
REACT_APP_ENV=development
```

4. Start the development server:
```powershell
npm start
# or
yarn start
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App
- `npm run lint` - Runs ESLint
- `npm run format` - Formats code with Prettier

## Testing

The project uses Jest and React Testing Library for testing. Tests are located in `__tests__` directories next to the files they test.

Run tests:
```powershell
npm test
```

Run tests with coverage:
```powershell
npm test -- --coverage
```

## Code Style and Conventions

- Use functional components with hooks
- Follow React best practices and patterns
- Use TypeScript-like prop validation
- Follow Material-UI theming guidelines
- Implement proper error handling
- Write comprehensive tests

## State Management

### Redux Store Structure

```
store/
├── store.js              # Store configuration
├── GlobalStore.js        # Global store provider
└── slices/
    ├── userSlice.js     # User authentication and profile
    └── appointmentsSlice.js # Appointment management
```

### State Slices

1. User Slice:
   - Authentication state
   - User profile
   - Permissions
   - Preferences

2. Appointments Slice:
   - Appointment list
   - Appointment details
   - Filters and sorting
   - Search state

### Best Practices

- Use selectors for accessing state
- Implement proper error handling
- Use thunks for async operations
- Keep normalized state structure
- Handle loading states properly

## Project Architecture

### Core Directories

```
src/
├── api/          # API integration layer
│   ├── client.js      # Base API client
│   ├── apiService.js  # Common API utilities
│   └── [feature]Api.js # Feature-specific API calls
│
├── components/   # Reusable UI components
│   ├── __tests__/     # Component tests
│   ├── styles/        # Component styles
│   └── [Component].js # React components
│
├── hooks/       # Custom React hooks
│   ├── __tests__/     # Hook tests
│   ├── useAuth.js     # Authentication hook
│   └── useAsync.js    # Async operations hook
│
├── pages/       # Page components
│   ├── __tests__/     # Page tests
│   ├── styles/        # Page styles
│   └── [Page].js     # Page components
│
├── store/       # Redux store configuration
│   ├── slices/        # Redux slices
│   └── store.js      # Store setup
│
└── utils/       # Helper functions
    ├── apiHelpers.js  # API utilities
    ├── authUtils.js   # Auth utilities
    └── cookieHelper.js # Cookie management
```

### Key Components

1. Authentication:
   - LoginCard
   - PrivateRoute
   - useAuth hook

2. Appointment Management:
   - OpenAppointments
   - PendingAppointments
   - CompleteAppointments

3. Referral System:
   - Referrals
   - ReferPatientpage
   - InviteDoctorDialog

4. Utilities:
   - ErrorBoundary
   - FormValidation
   - NotificationSystem

## Development Workflow

1. Feature Development:
   ```bash
   git checkout -b feature/new-feature
   npm install  # If new dependencies
   npm start
   # Make changes
   npm test
   npm run lint
   # Commit changes
   ```

2. Running Tests:
   ```bash
   npm test            # Run tests
   npm run test:coverage  # Check coverage
   ```

3. Code Quality:
   ```bash
   npm run lint      # Check code style
   npm run lint:fix  # Auto-fix issues
   npm run format    # Format code
   ```

## Performance Optimization

- Code splitting with React.lazy
- Component memoization
- Redux selectors
- Optimized build setup

## Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:8081
REACT_APP_ENV=development
REACT_APP_VERSION=$npm_package_version
```

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## Testing

See [TESTING.md](TESTING.md) for detailed testing documentation.
