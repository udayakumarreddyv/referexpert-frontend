# Contributing to ReferExpert Frontend

Thank you for your interest in contributing to ReferExpert! This document provides guidelines and instructions for contributing to the project.

## Getting Started

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file (see README.md)
4. Start the development server: `npm start`
5. Create a new branch for your work

## Development Process

1. Choose an issue to work on or create a new one
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Implement your changes following our guidelines
4. Write or update tests
5. Update documentation
6. Submit a pull request

## Code Style Guidelines

### General

- Use consistent naming conventions
  - PascalCase for components
  - camelCase for functions and variables
  - UPPER_SNAKE_CASE for constants
- Write self-documenting code
- Keep functions small and focused
- Use meaningful variable names
- Add comments for complex logic

### React Components

- Use functional components with hooks
- Keep components small and reusable (< 250 lines)
- Extract complex logic into custom hooks
- Follow React best practices:
  - Use proper effect dependencies
  - Memoize callbacks and values when needed
  - Use proper key props in lists
- Implement prop validation with PropTypes
- Use TypeScript for new components

### State Management

- Use local state for UI-only state
- Use Redux for:
  - Shared state
  - Server cache
  - Global UI state
- Follow Redux best practices:
  - Use Redux Toolkit
  - Keep actions and reducers small
  - Use proper action names
  - Implement proper error handling

### Testing

- Write unit tests for all new features
- Maintain minimum 80% test coverage
- Test error cases and edge conditions
- Use meaningful test descriptions
- Follow testing best practices (see TESTING.md)

### Styling

- Use Material-UI components when possible
- Follow BEM naming convention for custom CSS
- Use CSS-in-JS for component-specific styles
- Follow accessibility guidelines
- Ensure responsive design

## Pull Request Process

1. Update documentation:
   - README.md for feature changes
   - API documentation for endpoint changes
   - Component documentation for new components
   
2. Submit quality code:
   - Run linting: `npm run lint`
   - Run tests: `npm test`
   - Check coverage: `npm run test:coverage`
   
3. Write clear commit messages:
   ```
   feat: Add user authentication
   
   - Implement JWT token handling
   - Add login and register forms
   - Add protected routes
   ```

4. Create a detailed PR description:
   - What changes were made
   - Why the changes were needed
   - How to test the changes
   - Screenshots for UI changes
   
5. Request review from maintainers

## Branch Naming Convention

- feature/feature-name
- fix/bug-description
- docs/documentation-update
- refactor/component-name
- test/feature-name

## Code Review Guidelines

1. Review criteria:
   - Code quality and style
   - Test coverage
   - Documentation
   - Performance impact
   - Security considerations

2. Response time:
   - First review within 2 business days
   - Follow-up reviews within 1 business day

3. Merging requirements:
   - Approved by at least one maintainer
   - All CI checks passing
   - No merge conflicts
   - Up-to-date with main branch

## Getting Help

- Join our Discord server
- Check existing issues and discussions
- Ask questions in PR comments
- Tag maintainers for urgent issues

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
