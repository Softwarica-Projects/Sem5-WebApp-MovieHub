import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../store/slices/userSlice';
export const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
    preloadedState: initialState,
  });
};

export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  } = {}
) => {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};


export const mockMovie = {
  _id: '1',
  title: 'Test Movie',
  description: 'A test movie description',
  genre: { _id: '1', name: 'Action' },
  cast: [{ name: 'Actor1', type: 'Director' }],
  director: 'Test Director',
  releaseDate: '2023-01-01',
  duration: 120,
  views: 100,
  rating: 4.5,
  coverImage: 'test-cover.jpg',
  trailerUrl: 'https://www.youtube.com/watch?v=test',
};

export const mockUser = {
  _id: '1',
  name: 'Test User',
  email: 'test@gmail.com',
  role: 'user',
};

export const mockAdmin = {
  _id: '2',
  name: 'Test Admin',
  email: 'admin@gmail.com',
  role: 'admin',
};


export const mockAuthenticatedState = {
  user: {
    token: 'mock-token',
    id: '1',
    name: 'Test User',
    role: 'user',
    isAuthenticated: true,
  },
};

export const mockAdminAuthenticatedState = {
  user: {
    token: 'mock-admin-token',
    id: '2',
    name: 'Test Admin',
    role: 'admin',
    isAuthenticated: true,
  },
};

export const mockAxiosResponse = (data) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {},
});

export const mockAxiosError = (message = 'Network Error', status = 500) => ({
  response: {
    data: { message },
    status,
    statusText: 'Internal Server Error',
  },
  message,
});
