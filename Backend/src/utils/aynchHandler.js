import ApiResponse from './ApiResponse';

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res
      .status(error.code || 500)
      .json(new ApiResponse(false, error.code || 500, error.message || 'Internal Server Error', null));
  }
};

export default asyncHandler;
