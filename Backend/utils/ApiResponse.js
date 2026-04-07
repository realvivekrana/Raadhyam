export const successResponse = (
  res,
  data = null,
  message = 'Success',
  statusCode = 200,
  extras = {}
) => {
  const response = {
    success: true,
    message
  };
  
  if (data !== null && data !== undefined) {
    response.data = data;
  }
  
  if (extras.pagination) {
    response.pagination = extras.pagination;
  }
  
  if (extras.meta) {
    response.meta = extras.meta;
  }
  
  if (Array.isArray(data)) {
    response.count = data.length;
  }
  
  return res.status(statusCode).json(response);
};

export const errorResponse = (
  res,
  message = 'An error occurred',
  statusCode = 500,
  errors = null,
  code = null
) => {
  const response = {
    success: false,
    message
  };
  
  if (code) {
    response.code = code;
  }
  
  if (errors) {
    response.errors = Array.isArray(errors) ? errors : [errors];
  }
  
  return res.status(statusCode).json(response);
};

export const createdResponse = (res, data = null, message = 'Created successfully') => {
  return successResponse(res, data, message, 201);
};

export const noContentResponse = (res) => {
  return res.status(204).send();
};

export const paginatedResponse = (
  res,
  data,
  pagination,
  message = 'Data retrieved successfully'
) => {
  return successResponse(res, data, message, 200, { pagination });
};

export const validationErrorResponse = (res, errors, message = 'Validation failed') => {
  return errorResponse(res, message, 400, errors, 'VALIDATION_ERROR');
};

export const unauthorizedResponse = (res, message = 'Authentication required') => {
  return errorResponse(res, message, 401, null, 'AUTH_REQUIRED');
};

export const forbiddenResponse = (res, message = 'Access denied') => {
  return errorResponse(res, message, 403, null, 'FORBIDDEN');
};

export const notFoundResponse = (res, message = 'Resource not found') => {
  return errorResponse(res, message, 404, null, 'NOT_FOUND');
};

export const conflictResponse = (res, message = 'Resource already exists') => {
  return errorResponse(res, message, 409, null, 'CONFLICT');
};

export const internalErrorResponse = (res, message = 'Internal server error', devError = null) => {
  if (process.env.NODE_ENV === 'development' && devError) {
    return errorResponse(res, message, 500, devError.message, 'INTERNAL_ERROR');
  }
  return errorResponse(res, message, 500, null, 'INTERNAL_ERROR');
};

export const listResponse = (
  res,
  items,
  count = null,
  message = 'Items retrieved successfully',
  pagination = null
) => {
  const response = {
    success: true,
    message,
    data: items
  };
  
  if (count !== null) {
    response.count = count;
  }
  
  if (pagination) {
    response.pagination = pagination;
  }
  
  return res.status(200).json(response);
};

export const itemResponse = (res, item, message = 'Item retrieved successfully') => {
  return successResponse(res, item, message);
};

export const updatedResponse = (res, item = null, message = 'Updated successfully') => {
  return successResponse(res, item, message, 200);
};

export const deletedResponse = (res, message = 'Deleted successfully') => {
  return successResponse(res, null, message, 200);
};

export default {
  successResponse,
  errorResponse,
  createdResponse,
  noContentResponse,
  paginatedResponse,
  validationErrorResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  conflictResponse,
  internalErrorResponse,
  listResponse,
  itemResponse,
  updatedResponse,
  deletedResponse
};
