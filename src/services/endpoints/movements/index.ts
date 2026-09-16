import { api } from '../../api';
import type {
  IMovement,
  IGetMovementsParams,
  ICreateMovementRequestBody,
  IUpdateMovementRequestBody,
} from './types';

export const movementsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Without params the API returns the full history. Returning the plain url rather than
    // `params: undefined` keeps that request free of a trailing '?'.
    getMovements: builder.query<IMovement[], IGetMovementsParams | void>({
      query: (params) => (params ? { url: '/movements', params } : '/movements'),
      providesTags: ['Movement'],
      // No caching: the entry is dropped as soon as nothing subscribes to it, so remounting the
      // page or changing the selected months always refetches rather than showing a stale response.
      keepUnusedDataFor: 0,
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
      invalidatesTags: ['Movement'],
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
