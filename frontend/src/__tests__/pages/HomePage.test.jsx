import React from 'react';
import { screen } from '@testing-library/react';
import HomePage from '../../pages/HomePage';
import { renderWithProviders } from '../../test-utils/testUtils.helper';

jest.mock('../../components/FeaturedMovie', () => {
  return function MockFeaturedMovie() {
    return <div data-testid="featured-movie">Featured Movie</div>;
  };
});

jest.mock('../../components/PopularMovies', () => {
  return function MockPopularMovies() {
    return <div data-testid="popular-movies">Popular Movies</div>;
  };
});

jest.mock('../../components/RecentlyAdded', () => {
  return function MockRecentlyAdded() {
    return <div data-testid="recently-added">Recently Added</div>;
  };
});

jest.mock('../../components/ReleasingSoon', () => {
  return function MockReleasingSoon() {
    return <div data-testid="releasing-soon">Releasing Soon</div>;
  };
});

jest.mock('../../layout/PublicLayout', () => {
  return function MockPublicLayout({ children }) {
    return <div data-testid="public-layout">{children}</div>;
  };
});

describe('HomePage Component', () => {
  test('renders all main sections', () => {
    renderWithProviders(<HomePage />);
    
    expect(screen.getByTestId('public-layout')).toBeInTheDocument();
    expect(screen.getByTestId('featured-movie')).toBeInTheDocument();
    expect(screen.getByTestId('popular-movies')).toBeInTheDocument();
    expect(screen.getByTestId('recently-added')).toBeInTheDocument();
    expect(screen.getByTestId('releasing-soon')).toBeInTheDocument();
  });

  test('renders sections in correct order', () => {
    renderWithProviders(<HomePage />);
    
    const publicLayout = screen.getByTestId('public-layout');
    const children = Array.from(publicLayout.children);
    
    expect(children[0]).toHaveAttribute('data-testid', 'featured-movie');
    expect(children[1]).toHaveAttribute('data-testid', 'popular-movies');
    expect(children[2]).toHaveAttribute('data-testid', 'recently-added');
    expect(children[3]).toHaveAttribute('data-testid', 'releasing-soon');
  });
});
