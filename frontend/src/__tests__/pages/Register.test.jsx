import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from '../../pages/user/Register';
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

describe('Register Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    authService.registerUser.mockClear();
    toastUtils.handleSuccess.mockClear();
    toastUtils.handleError.mockClear();
    mockNavigate.mockClear();
  });

  test('renders register form and shows validation errors for empty fields', async () => {
    renderWithProviders(<Register />);
    
    expect(screen.getByPlaceholderText(/enter name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  test('successful registration', async () => {
    const mockResponse = {
      message: 'User registered successfully',
      user: {
        id: '123',
        name: 'Rishan Shrestha',
        email: 'rishan@gmail.com',
      },
    };
    
    authService.registerUser.mockResolvedValue(mockResponse);
    
    renderWithProviders(<Register />);
    
    const nameInput = screen.getByPlaceholderText(/enter name/i);
    const emailInput = screen.getByPlaceholderText(/enter email/i);
    const passwordInput = screen.getByPlaceholderText(/enter password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    
    await user.type(nameInput, 'Rishan Shrestha');
    await user.type(emailInput, 'rishan@gmail.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(authService.registerUser).toHaveBeenCalledWith({
        name: 'Rishan Shrestha',
        email: 'rishan@gmail.com',
        password: 'password123',
      });
      expect(toastUtils.handleSuccess).toHaveBeenCalledWith('Registration successful!');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('login link navigates to login page', () => {
    renderWithProviders(<Register />);
    
    const loginLink = screen.getByText(/sign in/i);
    expect(loginLink.closest('a')).toHaveAttribute('href', '/login');
  });
});
