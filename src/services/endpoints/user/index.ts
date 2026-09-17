import { api } from '../../api';
import type { ILoginRequestBody, ILoginResponseBody, TGetAllUsersResponseBody } from './types';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ILoginResponseBody, ILoginRequestBody>({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    getAllUsers: builder.query<TGetAllUsersResponseBody, void>({
      query: () => '/users-admin/list',
    }),
  }),
});

export const { useLoginMutation, useGetAllUsersQuery } = userApi;
