import React from 'react';
import { screen } from '@testing-library/react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { renderWithProviders, mockAuthenticatedState, mockAdminAuthenticatedState } from '../../test-utils/testUtils.helper';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }) => {
    mockNavigate(to);
    return <div data-testid="navigate-redirect">Redirecting to {to}</div>;
  },
}));

describe('ProtectedRoute Component', () => {
  const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  test('renders children when user is authenticated and has correct role', () => {
    renderWithProviders(
      <ProtectedRoute role={['user']}>
        <TestComponent />
      </ProtectedRoute>,
      { preloadedState: mockAuthenticatedState }
    );
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate-redirect')).not.toBeInTheDocument();
  });

  test('renders children when admin accesses user route', () => {
    renderWithProviders(
      <ProtectedRoute role={['user', 'admin']}>
        <TestComponent />
      </ProtectedRoute>,
      { preloadedState: mockAdminAuthenticatedState }
    );
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate-redirect')).not.toBeInTheDocument();
  });

  test('redirects when user is not authenticated', () => {
    renderWithProviders(
      <ProtectedRoute role={['user']}>
        <TestComponent />
      </ProtectedRoute>
    );
    
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('navigate-redirect')).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('redirects when user does not have required role', () => {
    renderWithProviders(
      <ProtectedRoute role={['admin']}>
        <TestComponent />
      </ProtectedRoute>,
      { preloadedState: mockAuthenticatedState }
    );
    
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('navigate-redirect')).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
