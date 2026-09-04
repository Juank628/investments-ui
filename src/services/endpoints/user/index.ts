import { api } from '../../api';
import type { ILoginRequestBody, ILoginResponseBody } from './types';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ILoginResponseBody, ILoginRequestBody>({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = userApi;
