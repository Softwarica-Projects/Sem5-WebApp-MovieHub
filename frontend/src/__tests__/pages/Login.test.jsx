import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../pages/user/Login';
import { renderWithProviders } from '../../test-utils/testUtils.helper';
import * as authService from '../../services/authService';
import * as toastUtils from '../../utils/toastUtils';

jest.mock('../../services/authService');
jest.mock('../../utils/toastUtils');
jest.mock('../../layout/PublicLayout', () => {
  return function MockPublicLayout({ children }) {
    return <div data-testid="public-layout">{children}</div>;
  };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe('Login Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    authService.loginUser.mockClear();
    toastUtils.handleSuccess.mockClear();
    toastUtils.handleError.mockClear();
    mockNavigate.mockClear();
  });

  test('renders login form', () => {
    renderWithProviders(<Login />);
    
    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/new to movieHub/i)).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    renderWithProviders(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('shows validation error for invalid email format', async () => {
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    await user.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('successful login as regular user', async () => {
    const mockResponse = {
      token: 'mock-token',
      id: '123',
      role: 'user',
      name: 'Rishan Shrestha',
    };
    
    authService.loginUser.mockResolvedValue(mockResponse);
    
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'test-user@gmail.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith({
        email: 'test-user@gmail.com',
        password: 'password123',
      });
      expect(toastUtils.handleSuccess).toHaveBeenCalledWith('User loggedin successful!');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('successful login as admin user', async () => {
    const mockResponse = {
      token: 'mock-admin-token',
      id: '456',
      role: 'admin',
      name: 'Admin User',
    };
    
    authService.loginUser.mockResolvedValue(mockResponse);
    
    renderWithProviders(<Login />);
    
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    await user.type(emailInput, 'admin@gmail.com');
    await user.type(passwordInput, 'adminpass123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(authService.loginUser).toHaveBeenCalledWith({
        email: 'admin@gmail.com',
        password: 'adminpass123',
      });
      expect(toastUtils.handleSuccess).toHaveBeenCalledWith('User loggedin successful!');
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });
  test('register link navigates to register page', () => {
    renderWithProviders(<Login />);
    
    const registerLink = screen.getByText(/sign up/i);
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });
});
