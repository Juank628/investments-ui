import { api } from '../../api';
import type { IMovement, ICreateMovementRequestBody, IUpdateMovementRequestBody } from './types';

export const movementsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMovements: builder.query<IMovement[], void>({
      query: () => '/movements',
    }),
    getMovement: builder.query<IMovement, string>({
      query: (id) => `/movements/${id}`,
    }),
    createMovement: builder.mutation<IMovement, ICreateMovementRequestBody>({
      query: (body) => ({
        url: '/movements',
        method: 'POST',
        body,
      }),
    }),
    updateMovement: builder.mutation<IMovement, { id: string; body: IUpdateMovementRequestBody }>({
      query: ({ id, body }) => ({
        url: `/movements/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteMovement: builder.mutation<void, string>({
      query: (id) => ({
        url: `/movements/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetMovementsQuery,
  useGetMovementQuery,
  useCreateMovementMutation,
  useUpdateMovementMutation,
  useDeleteMovementMutation,
} = movementsApi;
