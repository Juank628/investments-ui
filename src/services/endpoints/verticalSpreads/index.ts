import { api } from '../../api';
import type {
  IVerticalSpread,
  ICreateVerticalSpreadRequestBody,
  IUpdateVerticalSpreadRequestBody,
} from './types';

export const verticalSpreadsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVerticalSpreads: builder.query<IVerticalSpread[], void>({
      query: () => '/vertical-spreads',
    }),
    getVerticalSpread: builder.query<IVerticalSpread, string>({
      query: (id) => `/vertical-spreads/${id}`,
    }),
    createVerticalSpread: builder.mutation<IVerticalSpread, ICreateVerticalSpreadRequestBody>({
      query: (body) => ({
        url: '/vertical-spreads',
        method: 'POST',
        body,
      }),
    }),
    updateVerticalSpread: builder.mutation<
      IVerticalSpread,
      { id: string; body: IUpdateVerticalSpreadRequestBody }
    >({
      query: ({ id, body }) => ({
        url: `/vertical-spreads/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteVerticalSpread: builder.mutation<void, string>({
      query: (id) => ({
        url: `/vertical-spreads/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetVerticalSpreadsQuery,
  useGetVerticalSpreadQuery,
  useCreateVerticalSpreadMutation,
  useUpdateVerticalSpreadMutation,
  useDeleteVerticalSpreadMutation,
} = verticalSpreadsApi;
