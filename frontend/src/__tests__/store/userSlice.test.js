import userReducer, { login, logout, updateProfile, syncWithLocalStorage } from '../../store/slices/userSlice';

describe('userSlice', () => {
  const initialState = {
    token: null,
    id: null,
    name: null,
    role: null,
    isAuthenticated: false,
  };

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });
  test('should handle login', () => {
    const userData = {
      token: 'test-token',
      id: '123',
      name: 'Rishan Shrestha',
      role: 'user',
    };

    const actual = userReducer(initialState, login(userData));

    expect(actual).toEqual({
      token: 'test-token',
      id: '123',
      name: 'Rishan Shrestha',
      role: 'user',
      isAuthenticated: true,
    });

    expect(localStorage.getItem('token')).toBe('test-token');
    expect(localStorage.getItem('id')).toBe('123');
    expect(localStorage.getItem('name')).toBe('Rishan Shrestha');
    expect(localStorage.getItem('role')).toBe('user');
  });

  test('should handle logout', () => {
    const authenticatedState = {
      token: 'test-token',
      id: '123',
      name: 'Rishan Shrestha',
      role: 'user',
      isAuthenticated: true,
    };

    const actual = userReducer(authenticatedState, logout());

    expect(actual).toEqual(initialState);

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('id')).toBeNull();
    expect(localStorage.getItem('name')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
  });

  test('should handle updateProfile', () => {
    const authenticatedState = {
      token: 'test-token',
      id: '123',
      name: 'Rishan Shrestha',
      role: 'user',
      isAuthenticated: true,
    };

    const updatedData = {
      name: 'Rishan Updated',
    };

    const actual = userReducer(authenticatedState, updateProfile(updatedData));

    expect(actual).toEqual({
      ...authenticatedState,
      name: 'Rishan Updated',
    });

    expect(localStorage.getItem('name')).toBe('Rishan Updated');
  });
});
