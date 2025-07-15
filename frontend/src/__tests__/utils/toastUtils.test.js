import { toast } from 'react-toastify';
import { handleError, handleSuccess } from '../../utils/toastUtils';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('toastUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleError', () => {
    test('displays error message from response data', () => {
      const error = {
        response: {
          status: 400,
          data: {
            message: 'Validation failed',
          },
        },
      };

      handleError(error);

      expect(toast.error).toHaveBeenCalledWith('Validation failed');
    });

    test('displays error message from error.message', () => {
      const error = {
        message: 'Network error',
      };

      handleError(error);

      expect(toast.error).toHaveBeenCalledWith('Network error');
    });

    test('displays default message when no specific message', () => {
      const error = {};

      handleError(error);

      expect(toast.error).toHaveBeenCalledWith('Something went wrong');
    });

    test('displays custom default message', () => {
      const error = {};
      const customDefault = 'Custom error message';

      handleError(error, customDefault);

      expect(toast.error).toHaveBeenCalledWith(customDefault);
    });

    test('does not display toast for 401 status', () => {
      const error = {
        response: {
          status: 401,
          data: {
            message: 'Unauthorized',
          },
        },
      };

      handleError(error);

      expect(toast.error).not.toHaveBeenCalled();
    });

    test('does not display toast for 403 status', () => {
      const error = {
        response: {
          status: 403,
          data: {
            message: 'Forbidden',
          },
        },
      };

      handleError(error);

      expect(toast.error).not.toHaveBeenCalled();
    });

    test('prioritizes response.data.message over error.message', () => {
      const error = {
        message: 'Generic error',
        response: {
          status: 400,
          data: {
            message: 'Specific API error',
          },
        },
      };

      handleError(error);

      expect(toast.error).toHaveBeenCalledWith('Specific API error');
    });
  });

  describe('handleSuccess', () => {
    test('displays success message', () => {
      const message = 'Operation successful';

      handleSuccess(message);

      expect(toast.success).toHaveBeenCalledWith(message);
    });

    test('displays default success message', () => {
      handleSuccess();

      expect(toast.success).toHaveBeenCalledWith('Success');
    });
  });
});
