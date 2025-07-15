import { getImageUrl } from '../../utils/imageUtils';

describe('imageUtils', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getImageUrl', () => {
    test('returns null for null/undefined imagePath', () => {
      expect(getImageUrl(null)).toBeNull();
      expect(getImageUrl(undefined)).toBeNull();
      expect(getImageUrl('')).toBeNull();
    });

    test('returns full URL for http:// URLs', () => {
      const httpUrl = 'http://test.com/image.jpg';
      expect(getImageUrl(httpUrl)).toBe(httpUrl);
    });

    test('returns full URL for https:// URLs', () => {
      const httpsUrl = 'https://test.com/image.jpg';
      expect(getImageUrl(httpsUrl)).toBe(httpsUrl);
    });

    test('constructs URL with default base URL', () => {
      delete process.env.REACT_APP_API_BASE_URL;
      
      const imagePath = 'uploads/image.jpg';
      const result = getImageUrl(imagePath);
      expect(result).toMatch(/^https?:\/\/localhost:\d+\/uploads\/image\.jpg$/);
    });

    test('complex scenario with API base URL and various path formats', () => {
      process.env.REACT_APP_API_BASE_URL = 'https://production.moviehub.com/api/';
      
      expect(getImageUrl('uploads/poster.jpg')).toBe('https://production.moviehub.com/uploads/poster.jpg');
    });
  });
});
