import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useAuth } from '../../hooks/useAuth';
import { createTestStore, mockUser, mockAdmin } from '../../test-utils/testUtils.helper';

const createWrapper = (store) => {
  return ({ children }) => (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

describe('useAuth Hook', () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
    localStorage.clear();
  });

  test('returns initial state when not authenticated', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toEqual({
      token: null,
      id: null,
      name: null,
      role: null,
      isAuthenticated: false,
    });
    expect(result.current.token).toBeNull();
    expect(result.current.userId).toBeNull();
    expect(result.current.userName).toBeNull();
    expect(result.current.userRole).toBeNull();
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isUser).toBe(false);
  });

  test('loginUser updates authentication state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(store),
    });

    const userData = {
      token: 'test-token',
      id: '123',
      name: 'Rishan Shrestha',
      role: 'user',
    };

    act(() => {
      result.current.loginUser(userData);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe('test-token');
    expect(result.current.userId).toBe('123');
    expect(result.current.userName).toBe('Rishan Shrestha');
    expect(result.current.userRole).toBe('user');
    expect(result.current.isUser).toBe(true);
    expect(result.current.isAdmin).toBe(false);
  });

  test('loginUser with admin role sets isAdmin to true', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(store),
    });

    const adminData = {
      token: 'admin-token',
      id: '456',
      name: 'Admin User',
      role: 'admin',
    };

    act(() => {
      result.current.loginUser(adminData);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userRole).toBe('admin');
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isUser).toBe(false);
  });

  test('logoutUser clears authentication state', () => {

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(store),
    });

    const userData = {
      token: 'test-token',
      id: '123',
      name: 'Rishan Shrestha',
      role: 'user',
    };

    act(() => {
      result.current.loginUser(userData);
    });

    expect(result.current.isAuthenticated).toBe(true);


    act(() => {
      result.current.logoutUser();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toEqual({
      token: null,
      id: null,
      name: null,
      role: null,
      isAuthenticated: false,
    });
    expect(result.current.token).toBeNull();
    expect(result.current.userId).toBeNull();
    expect(result.current.userName).toBeNull();
    expect(result.current.userRole).toBeNull();
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isUser).toBe(false);
  });

  test('updateUserProfile updates user data', () => {

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(store),
    });

    const userData = {
      token: 'test-token',
      id: '123',
      name: 'Rishan Shrestha',
      role: 'user',
    };

    act(() => {
      result.current.loginUser(userData);
    });

    const updatedProfile = {
      name: 'Rishan Shrestha Updated',
    };

    act(() => {
      result.current.updateUserProfile(updatedProfile);
    });

    expect(result.current.user.name).toBe('Rishan Shrestha Updated');
  });

});
