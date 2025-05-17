import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock API responses
export const handlers = [
  // Auth endpoints
  rest.post('/referexpert/signin', (req, res, ctx) => {
    const { email, password } = req.body;
    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.json({
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          tokenType: 'Bearer'
        })
      );
    }
    return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }));
  }),

  rest.get('/referexpert/user', (req, res, ctx) => {
    const auth = req.headers.get('Authorization');
    if (!auth || !auth.includes('mock-access-token')) {
      return res(ctx.status(401));
    }
    return res(
      ctx.json({
        email: 'test@example.com',
        userType: 'DOCTOR',
        firstName: 'Test',
        lastName: 'User',
        officeName: 'Test Clinic'
      })
    );
  }),

  // Appointments endpoints
  rest.get('/referexpert/appointments', (req, res, ctx) => {
    const auth = req.headers.get('Authorization');
    if (!auth) return res(ctx.status(401));
    
    return res(
      ctx.json([
        {
          id: '1',
          status: 'PENDING',
          patientName: 'John Doe',
          appointmentTime: '2025-05-20T10:00:00Z'
        },
        {
          id: '2',
          status: 'OPEN',
          patientName: 'Jane Smith',
          appointmentTime: '2025-05-21T14:00:00Z'
        }
      ])
    );
  }),

  // User profile endpoints
  rest.put('/referexpert/user', (req, res, ctx) => {
    const auth = req.headers.get('Authorization');
    if (!auth) return res(ctx.status(401));
    
    return res(ctx.json(req.body));
  })
];

export const server = setupServer(...handlers);
