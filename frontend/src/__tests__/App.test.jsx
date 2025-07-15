import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from '../App';
import { createTestStore, mockAuthenticatedState, mockAdminAuthenticatedState } from '../test-utils/testUtils.helper';
import { render } from '@testing-library/react';

///[Mocking Pages]
jest.mock('../pages/HomePage', () => {
  return function MockHomePage() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock('../pages/user/Login', () => {
  return function MockLogin() {
    return <div data-testid="login-page">Login Page</div>;
  };
});

jest.mock('../pages/user/Register', () => {
  return function MockRegister() {
    return <div data-testid="register-page">Register Page</div>;
  };
});

jest.mock('../pages/admin/AdminDashboard', () => {
  return function MockAdminDashboard() {
    return <div data-testid="admin-dashboard">Admin Dashboard</div>;
  };
});

jest.mock('../components/ProtectedRoute', () => {
  return function MockProtectedRoute({ children }) {
    return <div data-testid="protected-route">{children}</div>;
  };
});

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    syncWithStorage: jest.fn(),
  }),
}));

jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    BrowserRouter: ({ children }) => children,
  };
});

const renderAppWithRouter = (initialEntries = ['/'], preloadedState = {}) => {
  const store = createTestStore(preloadedState);
  
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(<App />, { wrapper: Wrapper }) };
};

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders home page on root route', () => {
    renderAppWithRouter(['/']);
    
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  test('renders login page on /login route', () => {
    renderAppWithRouter(['/login']);
    
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('renders register page on /register route', () => {
    renderAppWithRouter(['/register']);
    
    expect(screen.getByTestId('register-page')).toBeInTheDocument();
  });

  test('renders protected admin dashboard for admin user', () => {
    renderAppWithRouter(['/admin'], mockAdminAuthenticatedState);
    
    expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
  });
});
