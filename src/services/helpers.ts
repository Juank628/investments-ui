import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { SerializedError } from '@reduxjs/toolkit';

export interface IErrorResponseBody {
  error?: string;
}

export const getErrorMessage = (error: FetchBaseQueryError | SerializedError): string => {
  if (
    'data' in error &&
    typeof error.data === 'object' &&
    error.data !== null &&
    'error' in error.data &&
    typeof error.data.error === 'string'
  ) {
    return error.data.error;
  }

  return 'Unexpected error';
};
